import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server"; 

export const loader = async ({ request }) => {
  console.log("App Proxy Plan Loader called");
  
  const url = new URL(request.url);
  const params = url.searchParams;

  const shop = params.get("shop");
  const signature = params.get("signature");
    
  const isValid = await authenticate.public.appProxy(request);
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
     case "FREE_PLAN":
      return {
        maxProducts: 10,
        csvUpload: false,
        multipleHandle: false,
      };
    case "BASE_PLAN":
      return {
        maxProducts: 20,
        csvUpload: true,
        multipleHandle: false,
      };
    case "PRO_PLAN":
      return {
        maxProducts: "infinity",
        csvUpload: true,
        multipleHandle: true,
      };
    default:
      return {};
  }
}
