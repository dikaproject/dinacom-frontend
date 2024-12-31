// SuccessConfirmation.tsx
"use client"
import { motion } from 'framer-motion';
import { FiCalendar, FiShare2, FiCheckCircle, FiDownload } from 'react-icons/fi';

const SuccessConfirmation = () => {
  // Mock booking details - replace with actual data from context/props
  const bookingDetails = {
    doctor: "Dr. Sarah Johnson",
    date: "March 15, 2024",
    time: "10:30 AM",
    location: "PregnaCare Hospital - Jakarta Pusat",
    bookingId: "PCB-2024031501"
  };

  const downloadCalendarFile = () => {
    // Implementation for calendar file download
    console.log('Downloading calendar file...');
  };

  const shareBooking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PregnaCare Appointment',
          text: `My appointment with ${bookingDetails.doctor} on ${bookingDetails.date} at ${bookingDetails.time}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="text-center space-y-8">
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
          Booking Confirmed!
        </h2>
        <p className="text-gray-600">
          Your appointment has been successfully scheduled
        </p>
      </motion.div>

      {/* Booking Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto"
      >
        <div className="space-y-4">
          <div className="text-left">
            <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
            <p className="text-gray-800">{bookingDetails.doctor}</p>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
            <p className="text-gray-800">
              {bookingDetails.date} at {bookingDetails.time}
            </p>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="text-gray-800">{bookingDetails.location}</p>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-medium text-gray-500">Booking ID</h3>
            <p className="text-gray-800">{bookingDetails.bookingId}</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
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

      {/* Download Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <button
          className="flex items-center justify-center mx-auto text-gray-600 hover:text-purple-600 transition-colors"
        >
          <FiDownload className="mr-2" />
          Download Booking Details
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessConfirmation;