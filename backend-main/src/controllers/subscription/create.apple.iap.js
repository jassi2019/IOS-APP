const axios = require("axios");

const env = require("../../config/env");
const { PAYMENT_PLATFORMS, PAYMENT_STATUSES } = require("../../constants");
const { Plan, Subscription } = require("../../models");
const { getPlanAppleProductId } = require("../../utils/appleIap");

const APPLE_VERIFY_RECEIPT_PRODUCTION = "https://buy.itunes.apple.com/verifyReceipt";
const APPLE_VERIFY_RECEIPT_SANDBOX = "https://sandbox.itunes.apple.com/verifyReceipt";

const verifyAppleReceipt = async (receipt) => {
  const payload = {
    "receipt-data": receipt,
    "exclude-old-transactions": true,
  };

  // Optional but recommended for auto-renewable subscriptions.
  if (env.APPLE_SHARED_SECRET) {
    payload.password = env.APPLE_SHARED_SECRET;
  }

  const post = async (url) => {
    const resp = await axios.post(url, payload, {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return resp.data;
  };

  let data = await post(APPLE_VERIFY_RECEIPT_PRODUCTION);

  // Sandbox receipt sent to production
  if (data && data.status === 21007) {
    data = await post(APPLE_VERIFY_RECEIPT_SANDBOX);
  }

  // Production receipt sent to sandbox
  if (data && data.status === 21008) {
    data = await post(APPLE_VERIFY_RECEIPT_PRODUCTION);
  }

  return data;
};

const extractReceiptItems = (verifyResponse) => {
  const items = [];

  // For subscriptions, Apple often returns latest_receipt_info
  if (Array.isArray(verifyResponse?.latest_receipt_info)) {
    items.push(...verifyResponse.latest_receipt_info);
  }

  // For other purchase types, use receipt.in_app
  if (Array.isArray(verifyResponse?.receipt?.in_app)) {
    items.push(...verifyResponse.receipt.in_app);
  }

  return items;
};

const receiptContainsProduct = (verifyResponse, productId) => {
  if (!productId) return false;
  const items = extractReceiptItems(verifyResponse);
  return items.some((i) => i?.product_id === productId || i?.productId === productId);
};

const getLatestExpirationMs = (verifyResponse, productId) => {
  const items = extractReceiptItems(verifyResponse).filter(
    (i) => i?.product_id === productId || i?.productId === productId
  );

  // expires_date_ms is only present for subscription receipts
  const expirations = items
    .map((i) => {
      const ms = i?.expires_date_ms || i?.expiresDateMs;
      const parsed = typeof ms === "string" ? parseInt(ms, 10) : ms;
      return Number.isFinite(parsed) ? parsed : null;
    })
    .filter((v) => typeof v === "number");

  if (expirations.length === 0) return null;
  return Math.max(...expirations);
};

const getLatestReceiptItemForProduct = (verifyResponse, productId) => {
  const items = extractReceiptItems(verifyResponse).filter(
    (i) => i?.product_id === productId || i?.productId === productId
  );

  const withExpiry = items
    .map((i) => {
      const ms = i?.expires_date_ms || i?.expiresDateMs;
      const parsed = typeof ms === "string" ? parseInt(ms, 10) : ms;
      return Number.isFinite(parsed) ? { item: i, expiryMs: parsed } : null;
    })
    .filter((v) => v && typeof v.expiryMs === "number");

  if (withExpiry.length === 0) return null;

  withExpiry.sort((a, b) => b.expiryMs - a.expiryMs);
  return withExpiry[0].item;
};

const createAppleIapV1 = async (req, res, next) => {
  try {
    const {
      planId,
      productId,
      transactionId,
      originalTransactionId,
      receipt,
      environmentIOS,
    } = req.body;

    if (!planId || !receipt) {
      return res.status(400).json({
        message: "Missing required fields: planId, receipt",
      });
    }

    const plan = await Plan.findByPk(planId);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const expectedProductId = getPlanAppleProductId(plan);
    if (!expectedProductId) {
      return res.status(400).json({
        message:
          "This plan is not configured for Apple IAP. Please set appleProductId for the plan.",
      });
    }

    // Verify receipt with Apple
    const verifyResponse = await verifyAppleReceipt(receipt);

    if (!verifyResponse || typeof verifyResponse.status !== "number") {
      return res.status(400).json({ message: "Invalid receipt verification response" });
    }

    if (verifyResponse.status !== 0) {
      return res.status(400).json({
        message: `Receipt verification failed (status: ${verifyResponse.status})`,
      });
    }

    if (env.APPLE_BUNDLE_ID) {
      const receiptBundleId = verifyResponse?.receipt?.bundle_id;
      if (!receiptBundleId) {
        return res.status(400).json({
          message: "Receipt is missing bundle_id",
        });
      }
      if (receiptBundleId !== env.APPLE_BUNDLE_ID) {
        return res.status(400).json({
          message: "Receipt bundle_id does not match this app",
        });
      }
    }

    if (!receiptContainsProduct(verifyResponse, expectedProductId)) {
      return res.status(400).json({
        message: "Receipt does not contain the expected product for this plan",
      });
    }

    const user = req.user;

    const latestItem = getLatestReceiptItemForProduct(verifyResponse, expectedProductId);
    const derivedTransactionId =
      transactionId || latestItem?.transaction_id || latestItem?.transactionId || null;
    const derivedOriginalTransactionId =
      originalTransactionId ||
      latestItem?.original_transaction_id ||
      latestItem?.originalTransactionId ||
      null;

    // Idempotency: avoid creating duplicates for the same transaction
    if (derivedTransactionId) {
      const existing = await Subscription.findOne({
        where: {
          userId: user.id,
          paymentId: derivedTransactionId,
          platform: PAYMENT_PLATFORMS.APPLE_IAP,
        },
      });

      if (existing) {
        return res.status(200).json({
          message: "Subscription already exists",
          data: existing,
        });
      }
    }

    const payableAmount = Math.round(plan.amount + (plan.amount * plan.gstRate) / 100);

    const latestExpiryMs = getLatestExpirationMs(verifyResponse, expectedProductId);
    if (!latestExpiryMs || !Number.isFinite(latestExpiryMs)) {
      return res.status(400).json({
        message:
          "Could not determine subscription expiration from receipt. Ensure APPLE_SHARED_SECRET is configured.",
      });
    }

    // Only grant access if subscription is currently active.
    if (latestExpiryMs <= Date.now()) {
      return res.status(400).json({
        message: "Subscription is not active. Please renew in the App Store.",
      });
    }

    const purchaseDateMs = latestItem?.purchase_date_ms || latestItem?.purchaseDateMs;
    const parsedPurchaseDateMs =
      typeof purchaseDateMs === "string" ? parseInt(purchaseDateMs, 10) : purchaseDateMs;
    const startDate =
      Number.isFinite(parsedPurchaseDateMs) && parsedPurchaseDateMs
        ? new Date(parsedPurchaseDateMs)
        : new Date();

    const endDate = new Date(latestExpiryMs);

    const subscription = await Subscription.create({
      planId: plan.id,
      userId: user.id,
      startDate,
      endDate,
      amount: payableAmount,
      paymentStatus: PAYMENT_STATUSES.SUCCESS,
      platform: PAYMENT_PLATFORMS.APPLE_IAP,
      paymentMethod: "APPLE_IAP",
      // Keep existing schema fields populated
      paymentId: derivedTransactionId || derivedOriginalTransactionId || "APPLE_IAP",
      orderId:
        derivedOriginalTransactionId ||
        derivedTransactionId ||
        productId ||
        expectedProductId,
      // Store raw receipt for audit/debug (can be large)
      signature: receipt,
      notes: environmentIOS ? `environmentIOS=${environmentIOS}` : null,
    });

    return res.status(201).json({
      message: "Subscription created successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createAppleIapV1;
