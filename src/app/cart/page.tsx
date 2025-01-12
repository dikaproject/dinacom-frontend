"use client"
import { useEffect, useState } from 'react';
import { cartService } from '@/services/cart';
import Cart from '@/components/section/cart/cart';
import { CartProduct } from '@/types/cart';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await cartService.getCart();
      setCartItems(data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  return <Cart cartItems={cartItems} loading={loading} />;
}