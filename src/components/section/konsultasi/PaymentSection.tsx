// PaymentSection.tsx
"use client"
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiCreditCard, FiLock, FiCheckCircle } from 'react-icons/fi';

interface PaymentSectionProps {
  nextStep: () => void;
  prevStep: () => void;
}

const PaymentSection = ({ nextStep, prevStep }: PaymentSectionProps) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Credit Card',
      icon: '/icons/credit-card.png',
      description: 'Pay securely with your credit card'
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      icon: '/icons/bank.png',
      description: 'Direct bank transfer'
    },
    {
      id: 'e-wallet',
      name: 'E-Wallet',
      icon: '/icons/wallet.png',
      description: 'Pay with your e-wallet'
    }
  ];

  const priceBreakdown = {
    consultation: 350000,
    serviceCharge: 15000,
    tax: 36500,
    total: 401500
  };

interface PaymentData {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
}

const handlePayment = async (): Promise<void> => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    nextStep();
};

  return (
    <div className="space-y-8">
      {/* Price Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-purple-50 p-6 rounded-lg"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Price Breakdown
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Consultation Fee</span>
            <span>Rp {priceBreakdown.consultation.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Service Charge</span>
            <span>Rp {priceBreakdown.serviceCharge.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>Rp {priceBreakdown.tax.toLocaleString()}</span>
          </div>
          <div className="h-px bg-purple-200 my-2" />
          <div className="flex justify-between font-semibold text-gray-800">
            <span>Total</span>
            <span>Rp {priceBreakdown.total.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Select Payment Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <motion.button
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 rounded-lg border ${
                selectedMethod === method.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <Image
                src={method.icon}
                alt={method.name}
                width={48}
                height={48}
                className="mx-auto mb-2"
              />
              <h4 className="font-medium text-gray-800">{method.name}</h4>
              <p className="text-sm text-gray-500">{method.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <AnimatePresence>
        {selectedMethod === 'credit-card' && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(handlePayment)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <div className="mt-1 relative">
                <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  {...register('cardNumber', {
                    required: 'Card number is required',
                    pattern: {
                      value: /^[0-9]{16}$/,
                      message: 'Invalid card number'
                    }
                  })}
                  className="pl-10 w-full border border-gray-200 rounded-lg text-gray-800 py-2 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cardNumber.message as string}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  {...register('expiryDate', {
                    required: 'Expiry date is required',
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                      message: 'Invalid format (MM/YY)'
                    }
                  })}
                  className="mt-1 w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="MM/YY"
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.expiryDate.message as string}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  type="text"
                  {...register('cvv', {
                    required: 'CVV is required',
                    pattern: {
                      value: /^[0-9]{3,4}$/,
                      message: 'Invalid CVV'
                    }
                  })}
                  className="mt-1 w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="123"
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.cvv.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mt-4">
              <FiLock className="mr-2" />
              Your payment information is secure and encrypted
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={prevStep}
          className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit(handlePayment)}
          disabled={!selectedMethod || isProcessing}
          className={`px-6 py-2 rounded-lg transition-colors flex items-center ${
            isProcessing
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentSection;