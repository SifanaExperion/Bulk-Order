import "@shopify/shopify-app-remix/adapters/node";
import { BillingInterval } from "@shopify/shopify-app-remix/server";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
export const BASE_PLAN = 'Base plan subscription';
export const PRO_PLAN = 'Pro plan subscription';
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
    billing: {
    BASE_PLAN: {
      amount: 100,
      currencyCode: "INR",
      interval: "EVERY_30_DAYS",
      trialDays: 7,
    },
    PRO_PLAN: {
      amount: 500,
      currencyCode: "INR",
      interval: "EVERY_30_DAYS",
      trialDays: 12,
    },
  },

  future: {
    v3_lineItemBilling: true, 
  },
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
