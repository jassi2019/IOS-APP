const env = require("../config/env");
const sendMail = require("../services/mail");

const parseEmails = (value) =>
  String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const canSendEmail = () =>
  !!(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASSWORD && env.SMTP_FROM);

/**
 * Sends a non-blocking purchase notification email to DEVELOPER_EMAILS.
 * This is intended for internal bookkeeping/alerts (not a user-facing invoice).
 */
const sendPurchaseNotification = async ({ platform, user, plan, subscription, extra }) => {
  const to = parseEmails(env.DEVELOPER_EMAILS);
  if (to.length === 0) return;
  if (!canSendEmail()) return;

  const subject = `[${platform}] New purchase: ${plan?.name || plan?.id || "Plan"}`;
  const content = {
    platform,
    timestamp: new Date().toISOString(),
    userName: user?.name || null,
    userEmail: user?.email || null,
    userId: user?.id || null,
    planName: plan?.name || null,
    planId: plan?.id || null,
    paymentStatus: subscription?.paymentStatus || null,
    amount: subscription?.amount ?? null,
    paymentId: subscription?.paymentId || null,
    orderId: subscription?.orderId || null,
    startDate: subscription?.startDate ? new Date(subscription.startDate).toISOString() : null,
    endDate: subscription?.endDate ? new Date(subscription.endDate).toISOString() : null,
    notes: subscription?.notes || null,
    extraJson: extra ? JSON.stringify(extra, null, 2) : null,
  };

  try {
    await sendMail({
      to,
      subject,
      viewFileName: "billing/purchase.notification",
      content,
    });
  } catch (e) {
    // Never fail the purchase flow due to an internal email failure.
    console.log("purchase notification email failed", e?.message || e);
  }
};

module.exports = {
  sendPurchaseNotification,
};

