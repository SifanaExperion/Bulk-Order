import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  Button,
  List,
  InlineStack,
  Box,
  Link,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function Index() {
  return (
    <Page>
      <TitleBar title="Bulk Order App" />
      <BlockStack gap="500">
        <Layout>
          {/* Intro Section */}
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">
                  Welcome to the Bulk Order App !
                </Text>
                <Text as="p" variant="bodyMd">
                  The Bulk Order App makes it effortless for your customers to place{" "}
                  <strong>large or repeat orders</strong> quickly. 
                  Customers can search products, enter SKUs, or upload CSV files — with
                  automatic quantity merging for duplicates.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Steps to Add Block */}
          <Layout.Section>
            <Card title="Getting Started: Add the Bulk Order Block" sectioned>
              <Text as="p" variant="bodyMd">
                To enable Bulk Ordering on your storefront, you need to add the{" "}
                <strong>Bulk Order Block</strong> to one of your theme pages:
              </Text>
              <List type="number">
                <List.Item>
                  In your Shopify admin, go to{" "}
                  <strong>Online Store → Themes</strong>.
                </List.Item>
                <List.Item>
                  Click <strong>Customize</strong> on your current theme.
                </List.Item>
                <List.Item>
                  Navigate to the page where you want bulk order functionality 
                  (e.g., <em>Wholesale</em> or <em>Quick Order</em> page).
                </List.Item>
                <List.Item>
                  Click <strong>Add Block</strong>, then select{" "}
                  <strong>Bulk Order App Block</strong>.
                </List.Item>
                <List.Item>
                  Save the changes and preview your storefront.
                </List.Item>
              </List>

              <InlineStack gap="300" align="start" blockAlign="center">
                <Button
                  url="shopify:admin/themes/current/editor?context=apps"
                  variant="primary"
                >
                  Open Theme Editor
                </Button>
              </InlineStack>
            </Card>
          </Layout.Section>

          {/* Plans & Benefits */}
          <Layout.Section>
            <Card title="Plans & Benefits" sectioned>
              <BlockStack gap="300">
                <Text as="h3" variant="headingMd">Base Plan - ₹100/month</Text>
                <List>
                  <List.Item>Search and add products up to 20 at a time</List.Item>
                  <List.Item>Csv upload</List.Item>
                  <List.Item>Bulk add to cart</List.Item>
                </List>

                <Text as="h3" variant="headingMd">Pro Plan - ₹500/month</Text>
                <List>
                  <List.Item>Everything in Base Plan</List.Item>
                  <List.Item>Add products without limit</List.Item>
                  <List.Item>Add products by entering handle line by line</List.Item>
                </List>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Screenshots */}
          <Layout.Section>
            <Card title="Screenshots" sectioned>
              <BlockStack gap="400">
                <Box>
                  <img
                    src="/app-assets/bulk-order-block.png"
                    alt="Bulk Order Block Example"
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                </Box>
                <Box>
                  <img
                    src="/app-assets/csv-upload.png"
                    alt="Bulk Order Cart Example"
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Demo Link */}
          <Layout.Section>
            <Card sectioned>
              <Text as="p" variant="bodyMd">
                Want to see it in action?{" "}
                <Link url="https://demo-bulk-order.myshopify.com" external>
                  View Demo Store
                </Link>
              </Text>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
