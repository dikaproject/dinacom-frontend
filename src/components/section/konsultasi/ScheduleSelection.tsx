"use client"

import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiCalendar, 
  FiAlertCircle, 
  FiX,
  FiChevronLeft,
  FiChevronRight, 
  FiVideo,
  FiMapPin
} from 'react-icons/fi';
import { format, addDays, isBefore, startOfToday } from 'date-fns';
import { ConsultationContext } from './Konsultasi';
import { ConsultationContextType } from '@/types/consultation';
import { consultationService } from '@/services/consultation';
import { toast } from 'react-hot-toast';

interface ScheduleSelectionProps {
  nextStep: () => void;
  prevStep: () => void;
}

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  reason?: 'BOOKED' | 'PASSED' | 'PENDING';
}

interface PaymentStatus {
  PENDING: string;
  PAID: string;
  FAILED: string;
}

type PaymentStatusType = keyof PaymentStatus;

interface PendingConsultation {
  id: string;
  doctor: {
    fullName: string;
  };
  schedule: string;
  type: 'ONLINE' | 'OFFLINE';
  payment: {
    amount: number;
    status: PaymentStatusType;
  };
}

const ScheduleSelection = ({ nextStep, prevStep }: ScheduleSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'ONLINE' | 'OFFLINE'>('OFFLINE');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingConsultation, setPendingConsultation] = useState<PendingConsultation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { consultationData, setConsultationData } = useContext(ConsultationContext) as ConsultationContextType;

  useEffect(() => {
    checkPendingConsultation();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSchedules();
    }
  }, [selectedDate, consultationData.doctorId]);
  

  const statusColors: PaymentStatus = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800'
  };

  const checkPendingConsultation = async () => {
    try {
      const response = await consultationService.checkPendingConsultation();
      if (response) {
        setPendingConsultation(response);
        setShowModal(true);
      }
    } catch (err) {
      console.error('Error checking pending consultation:', err);
      toast.error('Failed to check pending consultations');
    }
  };

  const handleCancelRequest = () => {
    setShowCancelConfirm(true);
    setShowModal(false);
  };

  const fetchAvailableSchedules = async () => {
    if (!consultationData.doctorId) return;
  
    setIsLoading(true);
    try {
      const { timeSlots } = await consultationService.getDoctorAvailableSchedules(
        consultationData.doctorId,
        format(selectedDate, 'yyyy-MM-dd')
      );
  
      // Convert UTC to WIB
      setTimeSlots(timeSlots.map(slot => ({
        time: convertToWIB(slot.time),
        isAvailable: slot.isAvailable,
        reason: slot.reason
      })));
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
      toast.error('Failed to fetch available schedules');
    } finally {
      setIsLoading(false);
    }
  };

  const convertToWIB = (time: string) => {
    const date = new Date();
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDateChange = (offset: number) => {
    const newDate = addDays(selectedDate, offset);
    if (!isBefore(newDate, startOfToday())) {
      setSelectedDate(newDate);
      setSelectedTime('');
    }
  };

  const handleCancelConsultation = async () => {
    if (!pendingConsultation) return;

  try {
    await consultationService.cancelConsultation(pendingConsultation.id);
    toast.success('Consultation cancelled successfully');
    setShowCancelConfirm(false);
    setPendingConsultation(null);
  } catch (error) {
    console.error('Failed to cancel consultation:', error);
    toast.error('Failed to cancel consultation');
  }
    setShowCancelConfirm(true);
  };

  const handleNext = () => {
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }

    setConsultationData({
      ...consultationData,
      schedule: `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`,
      type: consultationType
    });
    nextStep();
  };

  const renderPaymentStatusBadge = (status: keyof PaymentStatus) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    );
  };


  return (
    <div className="space-y-8">
      {/* Consultation Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Consultation Type</h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setConsultationType('ONLINE')}
            className={`
              p-4 rounded-lg border-2 flex flex-col items-center
              ${consultationType === 'ONLINE' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200'
              }
            `}
          >
            <FiVideo className="w-6 h-6 mb-2 text-purple-600" />
            <span className="font-medium">Online</span>
            <span className="text-sm text-gray-500">Video consultation</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setConsultationType('OFFLINE')}
            className={`
              p-4 rounded-lg border-2 flex flex-col items-center
              ${consultationType === 'OFFLINE' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200'
              }
            `}
          >
            <FiMapPin className="w-6 h-6 mb-2 text-purple-600" />
            <span className="font-medium">Offline</span>
            <span className="text-sm text-gray-500">Visit clinic</span>
          </motion.button>
        </div>
      </div>
      {/* Date Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Select Date</h3>
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <button
            onClick={() => handleDateChange(-1)}
            className="p-2 text-gray-600 hover:text-purple-600"
          >
            <FiChevronLeft size={24} />
          </button>
          
          <div className="flex items-center space-x-2 text-gray-800">
            <FiCalendar />
            <span className="font-medium">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>

          <button
            onClick={() => handleDateChange(1)}
            className="p-2 text-gray-600 hover:text-purple-600"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Select Time</h3>
        {isLoading ? (
          <div className="text-center py-8">Loading schedules...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {timeSlots.map((slot) => (
              <motion.button
                key={slot.time}
                whileHover={{ scale: slot.isAvailable ? 1.05 : 1 }}
                whileTap={{ scale: slot.isAvailable ? 0.95 : 1 }}
                onClick={() => slot.isAvailable && setSelectedTime(slot.time)}
                className={`
                  p-3 rounded-lg flex items-center justify-center
                  ${!slot.isAvailable 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : selectedTime === slot.time
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800 hover:border-purple-400'
                  }
                `}
                disabled={!slot.isAvailable}
              >
                <FiClock className="mr-2" />
                {slot.time}
                {!slot.isAvailable && (
                  <span className="text-xs ml-1">
                    ({slot.reason === 'PASSED' ? 'Passed' : 'Booked'})
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={prevStep}
          className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedTime}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          Continue
        </button>
      </div>

      {/* Pending Consultation Modal */}
      {showModal && pendingConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center text-yellow-500">
                <FiAlertCircle className="mr-2" size={24} />
                <h3 className="text-lg font-medium">Pending Consultation</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Consultation with {pendingConsultation.doctor.fullName}
                </p>
                {renderPaymentStatusBadge(pendingConsultation.payment.status)}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Schedule:</p>
                  <p className="text-sm text-gray-600 font-medium">
                    {format(new Date(pendingConsultation.schedule), 'PPpp')}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Type:</p>
                  <p className="text-sm text-gray-600 font-medium">{pendingConsultation.type}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Amount:</p>
                  <p className="text-sm text-gray-600 font-medium">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(pendingConsultation.payment.amount)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button
                  onClick={handleCancelRequest}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancel Consultation
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="space-y-4">
              <div className="flex items-center text-red-500">
                <FiAlertCircle className="mr-2" size={24} />
                <h3 className="text-lg font-medium">Cancel Consultation?</h3>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">
                  Warning: If you have already made a payment, the amount cannot be refunded. 
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    handleCancelConsultation();
                    setShowCancelConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ScheduleSelection;