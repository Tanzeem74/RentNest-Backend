import Stripe from "stripe";
import config from "../../config";
import { stripe } from "../../lib/stripe";

export const verifyWebhook = (
    body: Buffer,
    signature: string
) => {
    return stripe.webhooks.constructEvent(
        body,
        signature,
        config.stripe_webhook_secret
    );
};