// pages/cart/page.tsx
"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMinus, FiPlus, FiX, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "Prenatal Vitamins",
      price: 299000,
      quantity: 1,
      thumbnail: "/products/vitamins.jpg"
    },
    // Add more mock items
  ]);

  const shippingCost = 15000;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost;

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 flex items-center"
                    >
                      {/* Product Image */}
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="ml-6 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-sm text-purple-600">
                              Rp {item.price.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          {/* Quantity Adjuster */}
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 text-gray-600 hover:text-purple-600"
                            >
                              <FiMinus className="h-4 w-4" />
                            </button>
                            <span className="px-4 text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 text-gray-600 hover:text-purple-600"
                            >
                              <FiPlus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <p className="text-sm font-medium text-gray-900">
                            Rp {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {cartItems.length === 0 && (
                  <div className="p-6 text-center">
                    <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No items in cart</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add some products to your cart to continue shopping
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                href="/pregnashop"
                className="inline-flex items-center text-sm text-purple-600 hover:text-purple-500"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-base text-gray-600">
                  <p>Subtotal</p>
                  <p>Rp {subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-base text-gray-600">
                  <p>Shipping</p>
                  <p>Rp {shippingCost.toLocaleString()}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>Rp {total.toLocaleString()}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes included
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={cartItems.length === 0}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;