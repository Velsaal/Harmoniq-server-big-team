import { Resend } from "resend";
import createError from "http-errors";

const {
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  RESEND_TO_EMAIL,
  RESEND_SEND_CONFIRMATION,
} = process.env;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const ensureConfigured = () => {
  if (!resend || !RESEND_FROM_EMAIL || !RESEND_TO_EMAIL) {
    throw createError(
      500,
      "Email service is not configured. Please set RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL."
    );
  }
};

export const sendConsultationEmail = async (payload) => {
  ensureConfigured();

  const {
    consultationId,
    firstName,
    lastName,
    email,
    phone,
    notes = "",
  } = payload;

  const subject = `New consultation request ${consultationId}`;
  const text = [
    `Consultation ID: ${consultationId}`,
    `Name: ${firstName} ${lastName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    notes ? `Notes: ${notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: RESEND_TO_EMAIL,
    reply_to: email,
    subject,
    text,
  });

  const shouldSendConfirmation =
    RESEND_SEND_CONFIRMATION === "true" && Boolean(email);

  if (shouldSendConfirmation) {
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: email,
      subject: "We received your consultation request",
      text:
        "Thank you for your request. We will contact you shortly to confirm the details.",
    });
  }
};

export const sendPaymentReceiptEmail = async ({
  toEmail,
  amount,
  currency,
  orderId,
  consultationId,
}) => {
  ensureConfigured();

  const lines = [
    "Payment confirmed.",
    orderId ? `Order ID: ${orderId}` : null,
    consultationId ? `Consultation ID: ${consultationId}` : null,
    amount && currency ? `Amount: ${amount} ${currency}` : null,
  ].filter(Boolean);

  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: toEmail || RESEND_TO_EMAIL,
    subject: "Payment receipt",
    text: lines.join("\n"),
  });
};
