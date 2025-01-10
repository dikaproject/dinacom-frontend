"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cartService } from '@/services/cart';
import { CartProduct } from '@/types/cart';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageWrapper from '@/components/PageWrapper';
import Cart from '@/components/section/cart/Cart';

const CartPage = () => {
  const router = useRouter();
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
      console.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <main className="min-h-screen">
        <Navbar />
        <Cart cartItems={cartItems} loading={loading} />
        <Footer />
      </main>
    </PageWrapper>
  );
}

export default CartPage;
