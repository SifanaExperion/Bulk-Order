import { Page, Card, Button, Text, Modal } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { useNavigate } from "@remix-run/react";


export async function action({ request }) {
  const { billing ,session} = await authenticate.admin(request);
  const shop = session.shop.replace(".myshopify.com", "");
  const body = await request.json();
  const { actionType, plan } = body;
  const billingCheck = await billing.require({
    plans: [plan],
    onFailure: async () => billing.request({ plan: plan }),
  });
  const subscription = billingCheck.appSubscriptions[0];
  if (actionType === "subscribe") {
    const response = await billing.request({
      plan: plan === "FREE_PLAN" ? "PRO_PLAN" : "BASE_PLAN",
      isTest: true, 
      trialDays: plan.trialDays,
      returnUrl: `https://admin.shopify.com/store/${shop}/apps/bulk-order-20/app/confirm`,
    });

    return json({
      confirmationUrl: response.returnUrl,
      userErrors: response.userErrors || [],
    });
  }

  if (actionType === "cancel") {
    const response = await billing.cancel({
    subscriptionId: subscription.id,
    isTest: true,
    prorate: true,
    });
    console.log("cancel response",response);
    return json({
  confirmationUrl: response.returnUrl, 
  userErrors: response.userErrors || [],
});
  }

  return json({ error: "Invalid request" }, { status: 400 });
}

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`#graphql
    {
      currentAppInstallation {
        activeSubscriptions {
          name
          status
          trialDays
          createdAt
        }
      }
    }`
  );

  const data = await response.json();
  const activePlan =
    data?.data?.currentAppInstallation?.activeSubscriptions?.[0]?.name || null;

  return json({ activePlan });
}

export default function BillingPage() {
  const { activePlan } = useLoaderData();
    const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const handleSubscribe = async (plan) => {
    const response = await fetch("/app/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionType: "subscribe", plan }),
    });
    const { confirmationUrl, userErrors } = await response.json();

    if (userErrors?.length) {
      alert(userErrors.map((e) => e.message).join(", "));
      return;
    }

    if (!confirmationUrl)  
      {
      alert("Something went wrong. Please try again.");
      return;
    }
    navigate(confirmationUrl);
    window.location.href = confirmationUrl;
   };
  const handleCancel = async () => {
  setShowCancelModal(false);
    navigate("/app");
  const response = await fetch("/app/billing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actionType: "cancel", plan: activePlan }),
  });
  console.log("response of cancel 2",response);
  const { confirmationUrl, userErrors } = await response.json();
  if (userErrors?.length) {
    alert(userErrors.map((e) => e.message).join(", "));
    return;
  }

 if (confirmationUrl) {
  window.location.reload();
} else {
  window.location.reload();
}


 
}
  const plans = [
    {
      name: "base",
      title: "BASE_PLAN", 
      display_title: "Base Plan",
      price: "₹100 / month",
      features: ["Search and add up to 20 products", "Csv upload","Bulk Add to cart"],
    },
    {
      name: "pro",
      title: "PRO_PLAN", 
      display_title: "Pro Plan",
      price: "₹500 / month",
      features: ["Everything in base plan", "Add products without limit", "Add products by entering handle line by line"],
    },
  ];

  return (
  <Page title="Billing Plans" subtitle="Choose the plan that fits your needs">
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)", 
        gap: "20px",
      }}
    >
      {/* Static Free Plan */}
      <Card key="free" title="FREE_PLAN" sectioned>
        <p style={{ fontWeight: "600", fontSize: "16px" }}>Free Plan</p>
        <p style={{ fontWeight: "400", fontSize: "12px" }}>Free</p>
        <ul>
          <li>Search and add products</li>
          <li>Maximum 10 products per order</li>
          <li>Bulk Add to cart</li>

        </ul>
        {activePlan === null ? (
          <Button disabled variant="primary">
            Active
          </Button>
        ) : (
          <Button disabled>Included by default</Button>
        )}
      </Card>

      {/* Paid Plans */}
      {plans.map((plan) => (
        <Card key={plan.name} title={plan.display_title} sectioned>
          <p style={{ fontWeight: "600", fontSize: "16px" }}>{plan.display_title}</p>
          <p style={{ fontWeight: "400", fontSize: "12px" }}>{plan.price}</p>
          <ul>
            {plan.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          {activePlan === plan.title ? (
            <Button tone="critical" onClick={() => setShowCancelModal(true)}>
              Cancel subscription
            </Button>
          ) : (
            <Button onClick={() => handleSubscribe(plan.title)}>Subscribe</Button>
          )}
        </Card>
      ))}
    </div>

    {showCancelModal && (
      <Modal
        open
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
        primaryAction={{
          content: "Yes, cancel",
          destructive: true,
          onAction: handleCancel,
        }}
        secondaryActions={[
          {
            content: "No, keep plan",
            onAction: () => setShowCancelModal(false),
          },
        ]}
      >
        <Modal.Section>
          <Text>Are you sure you want to cancel your subscription?</Text>
        </Modal.Section>
      </Modal>
    )}
  </Page>
);

}
