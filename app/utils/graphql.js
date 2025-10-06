
export const METAFIELDS_SET_MUTATION = `
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
        type
      }
      userErrors {
        field
        message
      }
    }
  }
`;


export const ACTIVE_SUBSCRIPTIONS_QUERY = `
  query AppSubscriptions {
  shop {
    id
  }
    currentAppInstallation {
      activeSubscriptions {
        id
        name
        status
        createdAt
        trialDays
        test
      }
    }
  }
`;
export const GET_PLAN_METAFIELD_QUERY = `
  query getPlanMetafield($namespace: String!, $key: String!) {
    shop {
      metafield(namespace: $namespace, key: $key) {
        id
        namespace
        key
        value
      }
    }
  }
`;

