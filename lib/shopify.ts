const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const endpoint = `https://${domain}/api/2025-01/graphql.json`;

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Shopify fetch failed: ${res.status} ${res.statusText}`);
      return {} as T;
    }

    const json: { data?: T; errors?: unknown } = await res.json();
    if (json.errors) {
      console.error("Shopify API errors:", JSON.stringify(json.errors, null, 2));
      return {} as T;
    }

    return (json.data ?? {}) as T;
  } catch (err) {
    console.error("Shopify fetch threw:", err);
    return {} as T;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShopifyImage = {
  url: string;
  altText: string | null;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyVariant }[] };
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: {
      title: string;
      images: { edges: { node: { url: string } }[] };
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  lines: { edges: { node: CartLine }[] };
  cost: {
    totalAmount: { amount: string; currencyCode: string };
  };
};

// ─── Fragments ────────────────────────────────────────────────────────────────

const CART_FRAGMENT = `
  id
  checkoutUrl
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product {
              title
              images(first: 1) { edges { node { url } } }
            }
          }
        }
      }
    }
  }
  cost { totalAmount { amount currencyCode } }
`;

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>(`
    query Products {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            images(first: 5) {
              edges { node { url altText } }
            }
            variants(first: 10) {
              edges {
                node { id title availableForSale price { amount currencyCode } }
              }
            }
          }
        }
      }
    }
  `);
  return data.products?.edges.map((e) => e.node) ?? [];
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function createCart(): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartCreate: { cart: Cart } }>(`
    mutation CartCreate {
      cartCreate {
        cart { ${CART_FRAGMENT} }
      }
    }
  `);
  return data.cartCreate?.cart ?? null;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: Cart | null }>(
    `query Cart($cartId: ID!) { cart(id: $cartId) { ${CART_FRAGMENT} } }`,
    { cartId }
  );
  return data.cart ?? null;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: Cart } }>(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FRAGMENT} }
      }
    }`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] }
  );
  return data.cartLinesAdd?.cart ?? null;
}

export async function removeFromCart(
  cartId: string,
  lineId: string
): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: Cart } }>(
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FRAGMENT} }
      }
    }`,
    { cartId, lineIds: [lineId] }
  );
  return data.cartLinesRemove?.cart ?? null;
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: Cart } }>(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FRAGMENT} }
      }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  return data.cartLinesUpdate?.cart ?? null;
}
