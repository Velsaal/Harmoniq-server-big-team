import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import createError from "http-errors";

const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_ENV = "sandbox",
  PAYPAL_WEBHOOK_ID,
} = process.env;

const baseUrl =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const getEnvironment = () => {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw createError(
      500,
      "PayPal is not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET."
    );
  }

  if (PAYPAL_ENV === "live") {
    return new checkoutNodeJssdk.core.LiveEnvironment(
      PAYPAL_CLIENT_ID,
      PAYPAL_CLIENT_SECRET
    );
  }

  return new checkoutNodeJssdk.core.SandboxEnvironment(
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET
  );
};

export const getPayPalClient = () =>
  new checkoutNodeJssdk.core.PayPalHttpClient(getEnvironment());

export const createOrder = async ({
  amount,
  currency = "USD",
  description,
  returnUrl,
  cancelUrl,
  customId,
}) => {
  const client = getPayPalClient();

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
        description,
        ...(customId && { custom_id: customId }),
      },
    ],
    application_context: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
    },
  });

  const response = await client.execute(request);
  return response.result;
};

export const captureOrder = async (orderId) => {
  const client = getPayPalClient();

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  const response = await client.execute(request);
  return response.result;
};

const getAccessToken = async () => {
  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!tokenResponse.ok) {
    throw createError(502, "Failed to retrieve PayPal access token");
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
};

export const verifyWebhookSignature = async (req) => {
  if (!PAYPAL_WEBHOOK_ID) {
    throw createError(500, "PAYPAL_WEBHOOK_ID is not configured");
  }

  const accessToken = await getAccessToken();
  const transmissionId = req.headers["paypal-transmission-id"];
  const transmissionTime = req.headers["paypal-transmission-time"];
  const certUrl = req.headers["paypal-cert-url"];
  const authAlgo = req.headers["paypal-auth-algo"];
  const transmissionSig = req.headers["paypal-transmission-sig"];

  const payload = req.rawBody
    ? req.rawBody.toString("utf8")
    : JSON.stringify(req.body || {});

  const verifyResponse = await fetch(
    `${baseUrl}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(payload),
      }),
    }
  );

  if (!verifyResponse.ok) {
    throw createError(400, "Webhook verification failed");
  }

  const result = await verifyResponse.json();
  return result.verification_status === "SUCCESS";
};
