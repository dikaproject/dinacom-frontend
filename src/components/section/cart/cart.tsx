"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMinus,
  FiPlus,
  FiX,
  FiArrowLeft,
  FiShoppingBag,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { cartService } from "@/services/cart";
import { CartProduct, ShippingAddress } from "@/types/cart";
import toast from "react-hot-toast";
import ShippingAddressForm from "@/components/forms/shipping-addresss-form"; // Add this import
import { useRouter } from "next/navigation";
import { transactionService } from "@/services/transaction";
import { MidtransResult } from "@/types/midtrans";

interface CartProps {
  cartItems: CartProduct[];
  loading: boolean;
}

const Cart: React.FC<CartProps> = ({ cartItems, loading }) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [items, setItems] = useState<CartProduct[]>([]);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const loadAddresses = async () => {
    try {
      const addresses = await cartService.getShippingAddresses();
      setAddresses(addresses);
      if (addresses.length > 0) {
        setSelectedAddress(
          addresses.find((a) => a.isDefault)?.id || addresses[0].id
        );
      }
    } catch (error) {
      toast.error("Failed to load addresses");
    }
  };

   const handleCheckout = async () => {
      try {
          if (!selectedAddress || !items.length) {
              toast.error('Please select a shipping address and add items');
              return;
          }
  
          setIsProcessing(true);
          const totals = calculateTotals();
          
          const response = await transactionService.createTransaction({
              cartId: items[0].cartId,
              shippingAddressId: selectedAddress,
              amount: totals.total
          });
  
          if (!response.data.token) {
              throw new Error('Payment token not received');
          }
  
          if (typeof window.snap !== 'undefined') {
              window.snap.pay(response.data.token, {
                  onSuccess: (result: MidtransResult) => {
                      console.log('Payment success:', result);
                      router.push('/transaction/success');
                  },
                  onPending: (result: MidtransResult) => {
                      console.log('Payment pending:', result);
                      router.push('/transaction/pending');
                  },
                  onError: (result: MidtransResult) => {
                      console.error('Payment error:', result);
                      router.push('/transaction/error');
                  },
                  onClose: () => {
                      // Add cancellation logic
                      if (!document.querySelector('.snap-popup')) {
                          console.log('Customer closed without finishing payment');
                          transactionService.cancelTransaction(response.data.transaction.id);
                      }
                  }
              });
          }
      } catch (error) {
          console.error('Checkout error:', error);
          toast.error('Failed to process checkout');
      } finally {
          setIsProcessing(false);
      }
  };

  const handleUpdateQuantity = async (
    cartProductId: string,
    newQuantity: number
  ) => {
    try {
      if (newQuantity <= 0) {
        await handleRemoveItem(cartProductId);
        return;
      }

      await cartService.updateQuantity(cartProductId, newQuantity);
      const updatedCart = await cartService.getCart();
      setItems(updatedCart);
    } catch (error) {
      console.error("Failed to update cart:", error);
      toast.error("Failed to update cart");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await cartService.removeFromCart(productId);
      const updatedCart = await cartService.getCart();
      setItems(updatedCart);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    }
  };

  const calculateTotals = () => {
    // Calculate subtotal using product price directly
    const subtotal = items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Calculate fees based on subtotal
    const platformFee = Math.round(subtotal * 0.05); // 5%
    const tax = Math.round(subtotal * 0.12); // 12%
    const shippingCost = 10000; // Fixed shipping

    return {
      subtotal,
      platformFee,
      tax,
      shippingCost,
      total: subtotal + platformFee + tax + shippingCost,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {items.length} items in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {items.map((item) => (
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
  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/product/${item.product.thumbnail}` || "/placeholder.png"}
  alt={item.product.title}
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
                              {item.product.title}
                            </h3>
                            <p className="mt-1 text-sm text-purple-600">
                              Rp {item.product.price.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          {/* Quantity Adjuster */}
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-2 text-gray-600 hover:text-purple-600"
                            >
                              <FiMinus className="h-4 w-4" />
                            </button>
                            <span className="px-4 text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-2 text-gray-600 hover:text-purple-600"
                            >
                              <FiPlus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <p className="text-sm font-medium text-gray-900">
                            Rp{" "}
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {items.length === 0 && (
                  <div className="p-6 text-center">
                    <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No items in cart
                    </h3>
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
              <h2 className="text-lg font-medium text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-base text-gray-600">
                  <p>Subtotal</p>
                  <p>Rp {calculateTotals().subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-base text-gray-600">
                  <p>Platform Fee (5%)</p>
                  <p>Rp {calculateTotals().platformFee.toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-base text-gray-600">
                  <p>Tax (12%)</p>
                  <p>Rp {calculateTotals().tax.toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-base text-gray-600">
                  <p>Shipping</p>
                  <p>Rp {calculateTotals().shippingCost.toLocaleString()}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>Rp {calculateTotals().total.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-base font-medium text-gray-900">
                  Shipping Address
                </h3>
                {addresses.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className="flex items-start gap-3"
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium text-gray-700">{address.fullName}</p>
                          <p className="text-sm text-gray-600">
                            {address.phoneNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.address}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.district}, {address.city},{" "}
                            {address.province} {address.postalCode}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="mt-4 text-purple-600 hover:text-purple-500"
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              <motion.button
  onClick={handleCheckout}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  disabled={items.length === 0 || !selectedAddress}
  className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  Proceed to Checkout
</motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Add New Address
            </h3>
            <ShippingAddressForm
              onComplete={() => {
                setShowAddressForm(false);
                loadAddresses();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
