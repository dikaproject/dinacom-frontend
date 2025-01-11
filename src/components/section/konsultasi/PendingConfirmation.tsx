"use client"

import { motion } from 'framer-motion';
import { FiClock, FiAlertCircle, FiUser, FiCalendar, FiMapPin } from 'react-icons/fi';

interface PendingConfirmationProps {
  paymentDetails: {
    method: 'BANK_TRANSFER' | 'QRIS';
    amount: number;
    bankInfo?: {
      bankName: string;
      accountNumber: string;
      accountHolder: string;
    };
    qrisImage?: string;
  };
  consultation: {
    doctor: string;
    date: string;
    time: string;
    location: string;
    type: 'ONLINE' | 'OFFLINE';
  };
}

const PendingConfirmation = ({ paymentDetails, consultation }: PendingConfirmationProps) => {
  return (
    <div className="text-center space-y-8">
      {/* Pending Animation */}
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
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FiClock className="w-full h-full text-yellow-500" />
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
        <h2 className="text-2xl font-bold text-gray-800">
          Payment Pending Verification
        </h2>
        <p className="text-gray-600">
          {paymentDetails.method === 'BANK_TRANSFER' 
            ? 'Please wait while we verify your payment (1x24 hours)'
            : 'Please complete your QRIS payment'}
        </p>
      </motion.div>

      {/* Payment Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto"
      >
        <div className="space-y-4">
          {paymentDetails.method === 'BANK_TRANSFER' && paymentDetails.bankInfo && (
            <>
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-500">Bank Details</h3>
                <p className="text-gray-800">{paymentDetails.bankInfo.bankName}</p>
                <p className="text-gray-800">{paymentDetails.bankInfo.accountNumber}</p>
                <p className="text-gray-800">{paymentDetails.bankInfo.accountHolder}</p>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-500">Amount to Transfer</h3>
                <p className="text-gray-800 font-medium">
                  {new Intl.NumberFormat('id-ID', { 
                    style: 'currency', 
                    currency: 'IDR' 
                  }).format(paymentDetails.amount)}
                </p>
              </div>
            </>
          )}

          {paymentDetails.method === 'QRIS' && paymentDetails.qrisImage && (
            <div className="flex flex-col items-center gap-4">
              <img 
                src={paymentDetails.qrisImage} 
                alt="QRIS Code"
                className="w-48 h-48 object-contain"
              />
              <p className="text-sm text-gray-600">
                Scan QRIS code using your preferred payment app
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Booking Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-purple-50 rounded-xl p-6 max-w-md mx-auto"
      >
        <h3 className="font-medium text-purple-800 mb-4">Consultation Details</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <FiUser className="mt-1 text-purple-600" />
            <div className="text-left">
              <p className="text-sm text-purple-800">Doctor</p>
              <p className="text-purple-600">{consultation.doctor}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiCalendar className="mt-1 text-purple-600" />
            <div className="text-left">
              <p className="text-sm text-purple-800">Schedule</p>
              <p className="text-purple-600">
                {consultation.date} at {consultation.time}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FiMapPin className="mt-1 text-purple-600" />
            <div className="text-left">
              <p className="text-sm text-purple-800">
                {consultation.type === 'ONLINE' ? 'Consultation Type' : 'Location'}
              </p>
              <p className="text-purple-600">
                {consultation.type === 'ONLINE' ? 'Online Consultation' : consultation.location}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Important Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center text-yellow-600 bg-yellow-50 p-4 rounded-lg max-w-md mx-auto"
      >
        <FiAlertCircle className="mr-2" />
        <p className="text-sm">
          Your consultation will be confirmed after payment verification
        </p>
      </motion.div>
    </div>
  );
};

export default PendingConfirmation;