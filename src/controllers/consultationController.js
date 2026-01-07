import createError from "http-errors";
import {
  sendConsultationEmail,
  sendPaymentReceiptEmail,
} from "../utils/emailClient.js";
import {
  captureOrder,
  createOrder,
  verifyWebhookSignature,
} from "../utils/paypalClient.js";

const { PAYPAL_RETURN_URL, PAYPAL_CANCEL_URL } = process.env;

export const createConsultation = async (req, res, next) => {
  try {
    await sendConsultationEmail(req.body);

    res.status(201).json({
      status: "success",
      message: "Consultation request sent",
    });
  } catch (error) {
    next(error);
  }
};

export const createPayPalOrderController = async (req, res, next) => {
  try {
    const {
      amount,
      currency = "USD",
      description,
      consultationId,
      customerEmail,
      returnUrl,
      cancelUrl,
    } = req.body;

    const order = await createOrder({
      amount,
      currency,
      description,
      customId: consultationId,
      returnUrl: returnUrl || PAYPAL_RETURN_URL,
      cancelUrl: cancelUrl || PAYPAL_CANCEL_URL,
    });

    const approveLink =
      order?.links?.find((link) => link.rel === "approve")?.href || null;

    res.status(201).json({
      status: "success",
      data: {
        orderId: order.id,
        approveUrl: approveLink,
        intent: order.intent,
        customerEmail,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const capturePayPalOrderController = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const capture = await captureOrder(orderId);

    const captureInfo =
      capture?.purchase_units?.[0]?.payments?.captures?.[0] || {};
    const amount = captureInfo?.amount?.value;
    const currency = captureInfo?.amount?.currency_code;
    const payerEmail = capture?.payer?.email_address;
    const consultationId = capture?.purchase_units?.[0]?.custom_id;

    if (payerEmail) {
      await sendPaymentReceiptEmail({
        toEmail: payerEmail,
        amount,
        currency,
        orderId: capture?.id || orderId,
        consultationId,
      });
    }

    res.json({
      status: "success",
      data: capture,
    });
  } catch (error) {
    next(error);
  }
};

export const paypalWebhookController = async (req, res, next) => {
  try {
    const isValid = await verifyWebhookSignature(req);
    if (!isValid) {
      throw createError(400, "Invalid PayPal webhook signature");
    }

    const event = req.body;
    const eventType = event?.event_type;

    if (
      eventType === "PAYMENT.CAPTURE.COMPLETED" ||
      eventType === "CHECKOUT.ORDER.APPROVED"
    ) {
      const resource = event.resource || {};
      const payerEmail =
        resource?.payer?.email_address ||
        resource?.payment_source?.paypal?.email_address;
      const amount =
        resource?.amount?.value ||
        resource?.purchase_units?.[0]?.amount?.value;
      const currency =
        resource?.amount?.currency_code ||
        resource?.purchase_units?.[0]?.amount?.currency_code;
      const consultationId =
        resource?.custom_id || resource?.purchase_units?.[0]?.custom_id;

      if (payerEmail) {
        await sendPaymentReceiptEmail({
          toEmail: payerEmail,
          amount,
          currency,
          orderId: resource?.id,
          consultationId,
        });
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    next(error);
  }
};
