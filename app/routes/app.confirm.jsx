import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Text ,InlineStack ,Button,Link} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(`#graphql
    {
      currentAppInstallation {
        activeSubscriptions {
          id
          name
          status
          createdAt
          trialDays
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
    }`
  );
  const data = await response.json();
  return json({ subscriptions: data.data.currentAppInstallation.activeSubscriptions });
}

export default function BillingPage() {
  const { subscriptions } = useLoaderData();
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <Page title="Billing">
        <Layout>
            <Card>
              <Text variant="bodyMd">
                You don't have an active subscription yet. Please choose a plan.
              </Text>
              <Button
          variant="primary"
          url="/app/billing"
            >
         Select a plan
         </Button>
            </Card>
        </Layout>
      </Page>
    );
  }

  const currentPlan = subscriptions[0];
let trialEndsAt = null;
let formatted_trialEndsAt = null;
  if (currentPlan?.trialDays) {
    const createdAt = new Date(currentPlan.createdAt);
    createdAt.setDate(createdAt.getDate() + currentPlan.trialDays);
    trialEndsAt = createdAt.toISOString();
    const date = new Date(trialEndsAt);
    formatted_trialEndsAt= new Intl.DateTimeFormat("en-GB").format(date);
  }
  return (
    <Page title="Your Subscription Plan">
          <Card title={currentPlan.name}>
              <Text variant="bodyMd"><strong>Status:</strong> {currentPlan.status}</Text>
              <Text variant="bodyMd">
                <strong>Price:</strong>{" "}
                {currentPlan.lineItems[0].plan.pricingDetails.price.amount}{" "}
                {currentPlan.lineItems[0].plan.pricingDetails.price.currencyCode} /{" "}
                {currentPlan.lineItems[0].plan.pricingDetails.interval.toLowerCase()}
              </Text>
              {currentPlan.trialDays > 0 && (
                <Text variant="bodyMd"><strong>Trial Days:</strong> {currentPlan.trialDays}</Text>
              )}
              <Text variant="bodyMd"><strong>Trial Days Ending:</strong> {formatted_trialEndsAt}</Text>
              <Text variant="bodyMd">
                <strong>Started At:</strong>{" "}
                {new Date(currentPlan.createdAt).toLocaleDateString()}
              </Text>
              <Text variant="bodyMd">
                <strong>Plan:</strong>{" "}
                {currentPlan.name}
              </Text>
          </Card>
    </Page>
  );
}
