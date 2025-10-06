// app/routes/webhooks.subscription.js
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { ShopifyClient } from "../utils/client";
import { METAFIELDS_SET_MUTATION, ACTIVE_SUBSCRIPTIONS_QUERY } from "../utils/graphql";

const clientQuery = async (client, query, variables) => {
  try {
    return await client.query({ query, variables });
  } catch (error) {
    console.error("[Shopify Query Error]:", error);
    throw error;
  }
};

export const action = async ({ request }) => {
  console.log("subscription webhook called");
  const { topic, shop, session, payload } = await authenticate.webhook(request);

  if (topic === "APP_SUBSCRIPTIONS_UPDATE") {
    try {
      const subscription = payload?.app_subscription;
      console.log("Webhook payload:", payload);

      let activePlan = "FREE_PLAN";
      if (subscription?.status === "ACTIVE") {
        activePlan = subscription.name;
      }

      const client = new ShopifyClient(session.accessToken, shop);

      const shopQueryResult = await clientQuery(client, ACTIVE_SUBSCRIPTIONS_QUERY);

      const shopId = shopQueryResult?.shop?.id;
      if (!shopId) throw new Error("Could not fetch shopId");

      const metafieldsToSet = [
        {
          namespace: "app_settings",
          key: "plan_name",
          type: "single_line_text_field",
          value: activePlan,
          ownerId: shopId,
        }
      ];

      const setResponse = await clientQuery(client, METAFIELDS_SET_MUTATION, { metafields: metafieldsToSet });

      if (setResponse?.metafieldsSet?.userErrors?.length) {
        console.error("Metafield save errors:", setResponse.metafieldsSet.userErrors);
      } else {
        console.log(`Metafield updated for ${shop}: ${activePlan}`);
      }

    } catch (err) {
      console.error("Error updating metafield from webhook:", err);
    }
  }

  return json({ ok: true });
};
