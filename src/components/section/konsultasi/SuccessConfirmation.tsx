"use client"

import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiShare2, 
  FiCheckCircle, 
  FiDownload,
  FiCreditCard,
  FiMapPin,
  FiMessageCircle,
  FiClipboard,
  FiPrinter
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface SuccessConfirmationProps {
  consultation: {
    doctor: string;
    date: string;
    time: string;
    location?: string;
    bookingId: string;
    type: 'ONLINE' | 'OFFLINE';
  };
  payment: {
    amount: number;
    paymentMethod: string;
    transactionId: string;
    paymentDate: string;
  };
}

const SuccessConfirmation: React.FC<SuccessConfirmationProps> = ({ 
  consultation, 
  payment 
}) => {
  const downloadCalendarFile = () => {
    const eventData = {
      title: `Consultation with ${consultation.doctor}`,
      description: `${consultation.type} consultation at ${consultation.location || 'Online'}`,
      location: consultation.location || 'Online',
      startTime: `${consultation.date}T${consultation.time}`,
      duration: 60, // 1 hour consultation
    };
  
    // TODO: Implement calendar download
    console.log('Calendar event:', eventData);
    toast.success('Calendar event downloaded');
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  }


  const shareBooking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PregnaCare Consultation',
          text: `My consultation with ${consultation.doctor} is scheduled for ${consultation.date} at ${consultation.time}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
        toast.error('Failed to share booking details');
      }
    } else {
      toast.error('Sharing is not supported on this device');
    }
  };

  const printBookingDetails = () => {
    window.print();
  };

  const copyBookingId = () => {
    navigator.clipboard.writeText(consultation.bookingId);
    toast.success('Booking ID copied to clipboard');
  };

  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
      {/* Success Animation */}
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
            <FiCheckCircle className="w-full h-full text-green-500" />
          </motion.div>
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Payment Successful!
        </h2>
        <p className="text-gray-600">
          {consultation.type === 'ONLINE' 
            ? 'Your online consultation has been confirmed'
            : 'Your appointment has been successfully scheduled'
          }
        </p>
      </motion.div>

      {/* Payment Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-green-50 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-green-800">Payment Confirmation</h3>
          <FiCreditCard className="text-green-600 text-xl" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 text-left">
            <div>
              <p className="text-sm text-green-700">Amount Paid</p>
              <p className="text-green-800 font-medium">{formatIDR(payment.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-green-700">Payment Method</p>
              <p className="text-green-800">{payment.paymentMethod}</p>
            </div>
          </div>
          <div className="space-y-3 text-left">
            <div>
              <p className="text-sm text-green-700">Transaction ID</p>
              <p className="text-green-800 font-mono text-sm">{payment.transactionId}</p>
            </div>
            <div>
              <p className="text-sm text-green-700">Payment Date</p>
              <p className="text-green-800">{new Date(payment.paymentDate).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
              <p className="text-gray-800">{consultation.doctor}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
              <p className="text-gray-800">
                {consultation.date} at {consultation.time}
              </p>
            </div>
          </div>
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {consultation.type === 'ONLINE' ? 'Consultation Type' : 'Location'}
              </h3>
              <p className="text-gray-800 flex items-center gap-2">
                {consultation.type === 'ONLINE' ? (
                  <>
                    <FiMessageCircle className="text-purple-500" />
                    Online Consultation
                  </>
                ) : (
                  <>
                    <FiMapPin className="text-purple-500" />
                    {consultation.location}
                  </>
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Booking ID</h3>
              <div className="flex items-center gap-2">
                <p className="text-gray-800">{consultation.bookingId}</p>
                <button
                  onClick={copyBookingId}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <FiClipboard className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadCalendarFile}
          className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FiCalendar className="mr-2" />
          Add to Calendar
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={shareBooking}
          className="flex items-center justify-center px-6 py-3 bg-white text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
        >
          <FiShare2 className="mr-2" />
          Share Details
        </motion.button>
      </motion.div>

      {/* Additional Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center gap-4"
      >
        <button
          onClick={printBookingDetails}
          className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
        >
          <FiPrinter className="mr-2" />
          Print Details
        </button>
        <button
          onClick={() => toast.success('Booking details downloaded')}
          className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
        >
          <FiDownload className="mr-2" />
          Download PDF
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessConfirmation;