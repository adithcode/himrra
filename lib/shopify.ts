export async function shopifyFetch({ query, variables = {} }: { query: string; variables?: any }) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const endpoint = `https://${domain}/api/2026-04/graphql.json`;

  if (!domain || !key) {
    console.error('Missing Shopify environment variables');
    return null;
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 } // 60s — picks up Shopify inventory/variant changes quickly
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`Shopify API error: ${res.status} ${res.statusText}`, text);
      return null;
    }

    const body = await res.json();
    if (body.errors) {
      console.error('Shopify GraphQL errors:', body.errors);
      return null;
    }
    return body.data;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    return null;
  }
}

export async function createCart(variantId: string, quantity: number = 1) {
  const query = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lines: [
        {
          merchandiseId: variantId,
          quantity: quantity
        }
      ]
    }
  };

  const data = await shopifyFetch({ query, variables });
  
  if (data?.cartCreate?.userErrors?.length > 0) {
    console.error('Shopify cart errors:', data.cartCreate.userErrors);
    return null;
  }

  return data?.cartCreate?.cart;
}

export async function updateCartBuyerIdentity(cartId: string, buyerIdentity: any) {
  const query = `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    buyerIdentity
  };

  const data = await shopifyFetch({ query, variables });

  if (data?.cartBuyerIdentityUpdate?.userErrors?.length > 0) {
    const errorMsg = data.cartBuyerIdentityUpdate.userErrors.map((e: any) => e.message).join(', ');
    throw new Error(errorMsg);
  }

  return data?.cartBuyerIdentityUpdate?.cart;
}