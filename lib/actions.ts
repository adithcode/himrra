'use server';

import { createCart, updateCartBuyerIdentity } from './shopify';

export async function createCartAction(variantId: string, quantity: number = 1) {
  return await createCart(variantId, quantity);
}

export async function updateCartBuyerIdentityAction(cartId: string, buyerIdentity: any) {
  return await updateCartBuyerIdentity(cartId, buyerIdentity);
}
