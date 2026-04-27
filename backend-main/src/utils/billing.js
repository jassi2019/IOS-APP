const env = require("../config/env");
const sendMail = require("../services/mail");

const parseEmails = (value) =>
  String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const canSendEmail = () =>
  !!(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASSWORD && env.SMTP_FROM);

const formatDate = (d) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

/**
 * Sends a non-blocking purchase notification email to DEVELOPER_EMAILS.
 */
const sendPurchaseNotification = async ({ platform, user, plan, subscription, extra }) => {
  if (!canSendEmail()) return;

  const adminTo = parseEmails(env.DEVELOPER_EMAILS);
  const now = new Date();

  const adminContent = {
    platform,
    timestamp: now.toISOString(),
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

  // Send admin notification
  if (adminTo.length > 0) {
    sendMail({
      to: adminTo,
      subject: `[${platform}] New purchase: ${plan?.name || plan?.id || "Plan"} by ${user?.name || user?.email || "User"}`,
      viewFileName: "billing/purchase.notification",
      content: adminContent,
    }).catch((e) => console.log("admin notification email failed", e?.message || e));
  }

  // Send invoice to student
  if (user?.email) {
    const invoiceNo = `TNK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(subscription?.id || "").slice(-6).toUpperCase()}`;
    sendMail({
      to: [user.email],
      subject: `Payment Receipt - ${plan?.name || "Subscription"} | Taiyari NEET Ki`,
      viewFileName: "billing/invoice",
      content: {
        userName: user?.name || "Student",
        invoiceNo,
        date: formatDate(now),
        planName: plan?.name || "Subscription Plan",
        validUntil: formatDate(subscription?.endDate),
        paymentId: subscription?.paymentId || extra?.paymentId || "N/A",
        platform: platform || "Online",
        amount: subscription?.amount ?? "N/A",
        year: now.getFullYear(),
      },
    }).catch((e) => console.log("student invoice email failed", e?.message || e));
  }
};

module.exports = {
  sendPurchaseNotification,
};

