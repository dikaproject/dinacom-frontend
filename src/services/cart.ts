import { CartProduct } from '@/types/cart';

export const cartService = {
  getCart: (): CartProduct[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  addToCart: (product: any, quantity: number): void => {
    const cart = cartService.getCart();
    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: Date.now().toString(),
        productId: product.id,
        quantity,
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          description: product.description
        }
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  },

  updateQuantity: (productId: string, quantity: number): void => {
    const cart = cartService.getCart();
    const updatedCart = cart.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  },

  removeFromCart: (productId: string): void => {
    const cart = cartService.getCart();
    const updatedCart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  },

  clearCart: (): void => {
    localStorage.removeItem('cart');
  }
};
