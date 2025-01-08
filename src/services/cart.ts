import { CartProduct } from '@/types/cart';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCartProducts = async (userId: string): Promise<CartProduct[]> => {
  const response = await fetch(`${API_URL}/cart/${userId}`);
  return response.json();
};

export const addToCart = async (userId: string, productId: string, quantity: number) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId, quantity }),
  });
  return response.json();
};

export const updateCartProduct = async (cartProductId: string, quantity: number) => {
  const response = await fetch(`${API_URL}/cart/${cartProductId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  return response.json();
};

export const removeFromCart = async (cartProductId: string) => {
  const response = await fetch(`${API_URL}/cart/${cartProductId}`, {
    method: 'DELETE',
  });
  return response.json();
};
