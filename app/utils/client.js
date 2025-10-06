export class ShopifyClient {
  constructor(accessToken, shop) {
    if (!accessToken || !shop) {
      throw new Error("ShopifyClient requires accessToken and shop domain");
    }

    this.accessToken = accessToken;
    this.shop = shop.replace(/\.myshopify\.com$/, ""); 
    this.apiUrl = `https://${this.shop}.myshopify.com/admin/api/2025-01/graphql.json`;
  }

  async query({ query, variables = {} }) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": this.accessToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error("[Shopify GraphQL Errors]:", result.errors);
        throw new Error("GraphQL query failed");
      }

      return result.data;
    } catch (error) {
      console.error("[ShopifyClient.query Error]:", error);
      throw error;
    }
  }
}
