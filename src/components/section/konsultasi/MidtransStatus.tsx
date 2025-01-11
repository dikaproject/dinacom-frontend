"use client"

import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface MidtransStatusProps {
  status: 'success' | 'pending' | 'error';
  transaction?: {
    orderId: string;
    amount: number;
    date: string;
  };
  error?: string;
}

const MidtransStatus = ({ status, transaction, error }: MidtransStatusProps) => {
  const router = useRouter();

  const getStatusContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: <FiCheckCircle className="w-full h-full text-green-500" />,
          title: 'Payment Successful!',
          message: 'Your consultation has been confirmed',
          color: 'green'
        };
      case 'error':
        return {
          icon: <FiXCircle className="w-full h-full text-red-500" />,
          title: 'Payment Failed',
          message: error || 'There was an error processing your payment',
          color: 'red'
        };
      default:
        return {
          icon: <FiCheckCircle className="w-full h-full text-yellow-500" />,
          title: 'Payment Processing',
          message: 'Please wait while we confirm your payment',
          color: 'yellow'
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
      {/* Status Icon Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="w-24 h-24 mx-auto"
      >
        <div className="relative w-full h-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {content.icon}
          </motion.div>
        </div>
      </motion.div>

      {/* Status Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className={`text-2xl font-bold text-${content.color}-800`}>
          {content.title}
        </h2>
        <p className="text-gray-600">
          {content.message}
        </p>
      </motion.div>

      {/* Transaction Details */}
      {transaction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
              <p className="text-gray-800">{transaction.orderId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Amount</h3>
              <p className="text-gray-800">
                {new Intl.NumberFormat('id-ID', { 
                  style: 'currency', 
                  currency: 'IDR' 
                }).format(transaction.amount)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="text-gray-800">{transaction.date}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {status === 'error' && (
          <button
            onClick={() => router.push('/konsultasi')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default MidtransStatus;
