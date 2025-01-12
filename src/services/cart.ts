import api from './api';
import { CartSummary, ShippingAddress } from '@/types/cart';

export const cartService = {
  getCart: async () => {
    try {
        const { data } = await api.get('/cart/user');
        return data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
},

getShippingAddresses: async () => {
    try {
        const { data } = await api.get('/cart/shipping-addresses');
        return data;
    } catch (error) {
        console.error('Error fetching addresses:', error);
        throw error;
    }
},

addShippingAddress: async (address: Omit<ShippingAddress, 'id'>) => {
    try {
        const { data } = await api.post('/cart/shipping-address', address);
        return data;
    } catch (error) {
        console.error('Error adding address:', error);
        throw error;
    }
},

calculateFees: (subtotal: number): CartSummary => {
  const platformFee = Math.round(subtotal * 0.05); // 5%
  const tax = Math.round(subtotal * 0.12); // 12%
  const shippingCost = 10000; // Fixed 10k shipping
  
  return {
    subtotal,
    platformFee,
    tax,
    shippingCost,
    total: subtotal + platformFee + tax + shippingCost
  };
},

  addToCart: async (productId: string, quantity: number = 1) => {
    try {
        const { data } = await api.post('/cart', {
            productId,
            quantity
        });
        return data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
},

updateQuantity: async (cartProductId: string, quantity: number) => {
  try {
      if (quantity <= 0) {
          return await cartService.removeFromCart(cartProductId);
      }
      
      const { data } = await api.patch(`/cart/${cartProductId}`, {
          quantity
      });
      return data;
  } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
  }
},
removeFromCart: async (productId: string) => {
  try {
      await api.delete(`/cart/${productId}`);
      return { success: true };
  } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
  }
}
};