import React from 'react';

const Cart = () => {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Logo dan Header */}
      <div className="flex items-center mb-6">
        <img
          src="https://via.placeholder.com/50" // Ganti dengan URL logo Anda
          alt="Logo"
          className="w-12 h-12 mr-4"
        />
        <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
      </div>

      {/* Cart Items */}
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-6">
        <p className="text-center text-gray-500 text-lg">
          Your cart is empty. Start shopping now!
        </p>
      </div>

      {/* Cart Summary */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 mb-4">
          Total: <span className="text-green-500">$0.00</span>
        </p>
        <button className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
