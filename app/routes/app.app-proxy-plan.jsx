import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server"; 

export const loader = async ({ request }) => {
  console.log("App Proxy Plan Loader called");
  
  const url = new URL(request.url);
  const params = url.searchParams;

  const shop = params.get("shop");
  const signature = params.get("signature");

  const isValid = await authenticate.proxy(request); 
  if (!isValid) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const shopData = await db.shop.findUnique({ where: { shop } });
  const plan = shopData?.plan || "base"; 
  return json({
    shop,
    plan,
    features: getFeaturesForPlan(plan),
  });
};

function getFeaturesForPlan(plan) {
  switch (plan) {
    case "base":
      return {
        maxProducts: 10,
        csvUpload: false,
        advancedSearch: false,
      };
    case "pro":
      return {
        maxProducts: 50,
        csvUpload: true,
        advancedSearch: true,
      };
    case "enterprise":
      return {
        maxProducts: "unlimited",
        csvUpload: true,
        advancedSearch: true,
        prioritySupport: true,
      };
    default:
      return {};
  }
}
