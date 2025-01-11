"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiVideo, 
  FiMapPin, 
  FiClock, 
  FiUser, 
  FiDollarSign,
  FiPhone,
  FiMessageCircle,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { consultationService } from '@/services/consultation';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ConsultationHistory {
  id: string;
  type: 'ONLINE' | 'OFFLINE';
  schedule: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  doctor: {
    fullName: string;
    phoneNumber: string;
    layananKesehatan: {
      name: string;
      address: string;
    };
  };
  payment?: {
    amount: number;
    paymentStatus: string;
  };
}

const ConsultationPage = () => {
  const router = useRouter();
  const [consultations, setConsultations] = useState<ConsultationHistory[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE'>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationHistory | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [timeUntilConsultation, setTimeUntilConsultation] = useState<string>('');

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await consultationService.getUserConsultations();
      setConsultations(response as unknown as ConsultationHistory[]);
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
      toast.error('Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [statusFilter]);

  const getStatusColor = (status: ConsultationHistory['status']) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    } as const;
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredConsultations = consultations.filter(c => 
    (filter === 'ALL' || c.type === filter) &&
    (statusFilter === 'ALL' || c.status === statusFilter)
  );

  const handleJoinChat = (consultation: ConsultationHistory) => {
    try {
      // Check if consultation is online
      if (consultation.type !== 'ONLINE') {
        toast.error('Only online consultations can be joined');
        return;
      }
  
      // Block access if consultation is completed or cancelled
      if (consultation.status === 'COMPLETED' || consultation.status === 'CANCELLED') {
        toast.error('This consultation has ended');
        return;
      }
  
      // Allow access if status is CONFIRMED
      if (consultation.status !== 'CONFIRMED') {
        toast.error('Consultation must be confirmed to join chat');
        return;
      }
  
      router.push(`/dashboard/consultation/${consultation.id}/chat`);
    } catch (error) {
      console.error('Join chat error:', error);
      toast.error('Failed to join chat');
    }
  };

  useEffect(() => {
    if (selectedConsultation?.status === 'CONFIRMED') {
      const timer = setInterval(() => {
        const consultationTime = new Date(selectedConsultation.schedule);
        const now = new Date();
        const diff = consultationTime.getTime() - now.getTime();
        
        if (diff > 0) {
          const minutes = Math.floor(diff / 60000);
          const hours = Math.floor(minutes / 60);
          setTimeUntilConsultation(
            `Starts in: ${hours}h ${minutes % 60}m`
          );
        } else {
          setTimeUntilConsultation('');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedConsultation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Consultation History
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-xl ${
                  filter === 'ALL' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('ONLINE')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  filter === 'ONLINE' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                <FiVideo />
                Online
              </button>
              <button
                onClick={() => setFilter('OFFLINE')}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                  filter === 'OFFLINE' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                <FiMapPin />
                Offline
              </button>
            </div>
          </div>
          
          {/* Add status filter buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as typeof statusFilter)}
                className={`px-4 py-2 rounded-xl text-sm ${
                  statusFilter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Consultation List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredConsultations.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No consultations found
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredConsultations.map((consultation) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {consultation.type === 'ONLINE' ? (
                        <FiVideo className="text-purple-500" />
                      ) : (
                        <FiMapPin className="text-purple-500" />
                      )}
                      <span className="font-medium">
                        {consultation.type} Consultation
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getStatusColor(consultation.status)
                    }`}>
                      {consultation.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiUser className="flex-shrink-0" />
                      <span>Dr. {consultation.doctor.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="flex-shrink-0" />
                      <span>{format(new Date(consultation.schedule), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiClock className="flex-shrink-0" />
                      <span>{format(new Date(consultation.schedule), 'p')}</span>
                    </div>
                    {consultation.type === 'OFFLINE' && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <FiMapPin className="flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-medium">
                            {consultation.doctor.layananKesehatan.name}
                          </p>
                          <p className="text-sm">
                            {consultation.doctor.layananKesehatan.address}
                          </p>
                        </div>
                      </div>
                    )}
                    {consultation.payment && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiDollarSign className="flex-shrink-0" />
                        <span>
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR'
                          }).format(consultation.payment.amount)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setSelectedConsultation(consultation)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedConsultation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">Consultation Details</h3>
                  <button
                    onClick={() => setSelectedConsultation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {/* Status and Type */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {selectedConsultation.type === 'ONLINE' ? (
                          <FiVideo className="text-purple-500" size={20} />
                        ) : (
                          <FiMapPin className="text-purple-500" size={20} />
                        )}
                        <span className="font-medium">{selectedConsultation.type} Consultation</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedConsultation.status)}`}>
                        {selectedConsultation.status}
                      </span>
                    </div>

                    {/* Doctor Information */}
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Doctor Information</h4>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <FiUser className="text-gray-400" />
                          <span>Dr. {selectedConsultation.doctor.fullName}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FiPhone className="text-gray-400" />
                          <span>{selectedConsultation.doctor.phoneNumber}</span>
                        </p>
                      </div>
                    </div>

                    {/* Schedule Information */}
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Schedule</h4>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          <span>{format(new Date(selectedConsultation.schedule), 'PPP')}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FiClock className="text-gray-400" />
                          <span>{format(new Date(selectedConsultation.schedule), 'p')}</span>
                        </p>
                      </div>
                    </div>

                    {/* Location for Offline Consultation */}
                    {selectedConsultation.type === 'OFFLINE' && (
                      <div className="border-t pt-3">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Location</h4>
                        <div className="space-y-2">
                          <p className="font-medium">{selectedConsultation.doctor.layananKesehatan.name}</p>
                          <p className="text-sm text-gray-600">{selectedConsultation.doctor.layananKesehatan.address}</p>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              selectedConsultation.doctor.layananKesehatan.address
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                          >
                            <FiMapPin size={16} />
                            View on Map
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Payment Information */}
                    {selectedConsultation.payment && (
                      <div className="border-t pt-3">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Payment Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Amount</span>
                            <span className="font-medium">
                              {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR'
                              }).format(selectedConsultation.payment.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedConsultation.payment.paymentStatus === 'PAID'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedConsultation.payment.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3">
                  {selectedConsultation.type === 'ONLINE' && selectedConsultation.status === 'CONFIRMED' && (
  <>
    {timeUntilConsultation && (
      <p className="text-sm text-purple-600 font-medium mt-2">
        {timeUntilConsultation}
      </p>
    )}
    <button 
  onClick={() => handleJoinChat(selectedConsultation)}
  className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center gap-2"
>
  <FiMessageCircle />
  Join Chat
</button>
  </>
)}
                    {selectedConsultation.status === 'PENDING' && (
                      <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600">
                        Cancel Consultation
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedConsultation(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 rounded-xl hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationPage;