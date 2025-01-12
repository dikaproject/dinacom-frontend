import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import Link from 'next/link';

interface MidtransStatusProps {
  status: 'success' | 'pending' | 'error';
}

const MidtransStatus = ({ status }: MidtransStatusProps) => {
  const statusConfig = {
    success: {
      icon: FiCheckCircle,
      title: 'Payment Successful',
      color: 'text-green-500',
      message: 'Your transaction has been completed'
    },
    pending: {
      icon: FiClock,
      title: 'Payment Pending',
      color: 'text-yellow-500',
      message: 'Please complete your payment'
    },
    error: {
      icon: FiXCircle,
      title: 'Payment Failed',
      color: 'text-red-500',
      message: 'Something went wrong with your payment'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="max-w-lg mx-auto px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-lg shadow-md text-center"
      >
        <config.icon className={`w-16 h-16 mx-auto ${config.color}`} />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{config.title}</h1>
        <p className="mt-2 text-gray-600">{config.message}</p>
        <Link
          href="/pregnashop"
          className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Continue Shopping
        </Link>
      </motion.div>
    </div>
  );
};

export default MidtransStatus;