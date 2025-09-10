import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
console.log("Loader called for billing confirmation" );

  const response = await admin.graphql(`#graphql
    {
      currentAppInstallation {
        activeSubscriptions {
          id
          name
          status
          lineItems {
            plan {
              pricingDetails {
                __typename
                ... on AppRecurringPricing {
                  interval
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }`);
  const data = await response.json();
console.log("Current subscription data:", JSON.stringify(data, null, 2));

  return json({ subscription: data.data.currentAppInstallation.activeSubscriptions });
}
