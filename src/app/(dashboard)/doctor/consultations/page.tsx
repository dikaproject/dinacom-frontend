"use client";

import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiVideo,
  FiMapPin,
  FiClock,
  FiUser,
  FiMessageCircle,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiAlertCircle,
  FiPhone,
  FiMail,
  FiMessageSquare, // Add this
  FiImage,
} from "react-icons/fi";
import { format } from "date-fns";
import {
  consultationService,
  ConsultationStatus,
} from "@/services/consultation";
import { ConsultationHistory } from "@/types/consultation";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const DoctorConsultationPage = () => {
  const router = useRouter();
  const [consultations, setConsultations] = useState<ConsultationHistory[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | ConsultationStatus>(
    "ALL"
  );
  const [typeFilter, setTypeFilter] = useState<"ALL" | "ONLINE" | "OFFLINE">(
    "ALL"
  );
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationHistory | null>(null);
  const [showPaymentProof, setShowPaymentProof] = useState(false);
  const isMounted = useRef(true);
  const fetchDoctorConsultations = async () => {
    try {
      setLoading(true);
      const response = await consultationService.getAllConsultationsByStatus();
      if (isMounted.current) {
        let filtered = response.data;

        // Apply status filter with proper typing
        if (statusFilter !== "ALL") {
          filtered = filtered.filter((c: ConsultationHistory) => c.status === statusFilter);
        }

        // Apply type filter with proper typing
        if (typeFilter !== "ALL") {
          filtered = filtered.filter((c: ConsultationHistory) => c.type === typeFilter);
        }

        setConsultations(filtered);
      }
    } catch (error: unknown) {
      if (isMounted.current) toast.error("Failed to fetch consultations");
      console.error(error);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };


  useEffect(() => {
    isMounted.current = true;
    fetchDoctorConsultations();
    return () => {
      isMounted.current = false;
    };
  }, [statusFilter, typeFilter]);

  
  const handleStartConsultation = async (consultationId: string) => {
    try {
      // Check if consultation exists
      const consultation = consultations.find((c) => c.id === consultationId);
      if (!consultation) {
        toast.error('Consultation not found');
        return;
      }
  
      // Check if consultation type is online
      if (consultation.type !== "ONLINE") {
        toast.error("Only online consultations can be joined");
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
  
      router.push(`/doctor/consultations/${consultationId}/chat`);
    } catch {
      toast.error("Failed to start consultation");
    }
  };

  const handleUpdateStatus = async (
    consultationId: string,
    status: ConsultationStatus
  ) => {
    try {
      await consultationService.updateConsultationStatus(
        consultationId,
        status
      );
      if (isMounted.current) {
        toast.success("Status updated successfully");
        fetchDoctorConsultations();
      }
    } catch (error: unknown) {
      console.error(error);
      if (isMounted.current) toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: ConsultationStatus) => {
    const colors: Record<ConsultationStatus, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-green-100 text-green-800",
      COMPLETED: "bg-blue-100 text-blue-800",
      CANCELLED: "bg-red-100 text-red-800",
      IN_PROGRESS: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Update the PaymentProofModal component
  const PaymentProofModal = () => {
    const [imageError, setImageError] = useState(false);
  
    if (!selectedConsultation?.payment?.paymentProof) return null;
  
    // Get base URL from environment variable
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Construct image URL
    const imageUrl = `${baseUrl}/uploads/payments/${selectedConsultation.payment.paymentProof}`;
  
    return (
      <AnimatePresence>
        {showPaymentProof && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            >
              <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white rounded-t-2xl">
                <h3 className="text-lg font-semibold">Payment Proof</h3>
                <button
                  onClick={() => setShowPaymentProof(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="p-4 overflow-auto">
                {imageError ? (
                  <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                    <FiImage size={48} className="mb-4" />
                    <p>Failed to load payment proof image</p>
                  </div>
                ) : (
                  <Image
                    src={imageUrl}
                    alt="Payment Proof"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };
  
  const renderPaymentInfo = () => {
    if (!selectedConsultation?.payment) {
      return (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-500 text-sm">No payment information available</p>
        </div>
      );
    }
  
    const payment = selectedConsultation.payment;
    console.log('Payment details:', payment); // Debug log
  
    return (
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount</span>
          <span className="font-medium">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(payment.amount)}
          </span>
        </div>
  
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            payment.paymentStatus === 'PAID'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {payment.paymentStatus}
          </span>
        </div>
  
        {payment.paymentMethod && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Method</span>
            <span className="font-medium">{payment.paymentMethod}</span>
          </div>
        )}
  
        {/* Payment Proof Section */}
        {payment.paymentProof && (
          <div className="space-y-3 pt-3 border-t">
            <p className="text-sm text-gray-600 font-medium">Payment Proof</p>
            <button
              onClick={() => setShowPaymentProof(true)}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <FiImage />
              View Payment Proof
            </button>
  
            {/* Payment Actions for PENDING status */}
            {payment.paymentStatus === 'PENDING' && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    const message = encodeURIComponent(
                      `Hi Admin, I need verification for consultation payment:\n\n` +
                      `Consultation ID: ${selectedConsultation.id}\n` +
                      `Patient: ${selectedConsultation.user?.profile?.fullName}\n` +
                      `Amount: ${new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                      }).format(payment.amount)}\n` +
                      `Schedule: ${format(new Date(selectedConsultation.schedule), 'PPP p')}`
                    );
                    window.open(
                      `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_PHONE}?text=${message}`,
                      '_blank'
                    );
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <FiMessageSquare />
                  Contact Admin
                </button>
  
                <button
                  onClick={async () => {
                    try {
                      await consultationService.updateConsultationStatus(
                        selectedConsultation.id,
                        ConsultationStatus.CONFIRMED
                      );
                      toast.success('Payment verified successfully');
                      fetchDoctorConsultations();
                      setSelectedConsultation(null);
                    } catch (error) {
                      console.error('Verify payment error:', error);
                      toast.error('Failed to verify payment');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <FiCheckCircle />
                  Verify Payment
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            My Consultations
          </h1>

          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {["ALL", ...Object.values(ConsultationStatus)].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as typeof statusFilter)}
                  className={`px-4 py-2 rounded-xl text-sm ${
                    statusFilter === status
                      ? "bg-purple-600 text-white"
                      : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              {["ALL", "ONLINE", "OFFLINE"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type as typeof typeFilter)}
                  className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 ${
                    typeFilter === type
                      ? "bg-purple-600 text-white"
                      : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                  }`}
                >
                  {type === "ONLINE" ? (
                    <FiVideo />
                  ) : type === "OFFLINE" ? (
                    <FiMapPin />
                  ) : null}
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Consultation List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading consultations...</p>
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No consultations found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {consultations.map((consultation) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                {/* Card Header - Status and Type */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      consultation.status
                    )}`}
                  >
                    {consultation.status}
                  </span>
                  <div className="flex items-center gap-2">
                    {consultation.type === "ONLINE" ? (
                      <FiVideo className="text-purple-500" />
                    ) : (
                      <FiMapPin className="text-purple-500" />
                    )}
                    <span>{consultation.type}</span>
                  </div>
                </div>

                {/* Patient Info */}
                <div className="space-y-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    <div>
                      <p className="font-medium">
                        {consultation.user?.profile?.fullName}
                      </p>
                      <p className="text-sm text-gray-500">Patient</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-400" />
                    <span>
                      {format(new Date(consultation.schedule), "PPP")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiClock className="text-gray-400" />
                    <span>{format(new Date(consultation.schedule), "p")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {consultation.status === "CONFIRMED" &&
                    consultation.type === "ONLINE" && (
                      <button
  onClick={() => handleStartConsultation(consultation.id)}
  className="w-full px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center justify-center gap-2"
>
  <FiMessageCircle />
  Join Chat
</button>
                    )}

                  {consultation.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            consultation.id,
                            ConsultationStatus.CONFIRMED
                          )
                        }
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center justify-center gap-2"
                      >
                        <FiCheckCircle />
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            consultation.id,
                            ConsultationStatus.CANCELLED
                          )
                        }
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center justify-center gap-2"
                      >
                        <FiXCircle />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => setSelectedConsultation(consultation)}
                  className="mt-4 w-full px-4 py-2 text-purple-600 border border-purple-600 rounded-xl hover:bg-purple-50"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Consultation Details Modal */}
        <AnimatePresence>
          {selectedConsultation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
              >
                {/* Modal header - make it sticky */}
                <div className="p-6 border-b sticky top-0 bg-white rounded-t-2xl z-10">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">
                      Consultation Details
                    </h3>
                    <button
                      onClick={() => setSelectedConsultation(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                </div>

                {/* Scrollable content */}
                <div className="p-6 overflow-y-auto flex-1">
                  <div className="space-y-6">
                    {/* Status and Type */}
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          selectedConsultation.status
                        )}`}
                      >
                        {selectedConsultation.status}
                      </span>
                      <div className="flex items-center gap-2">
                        {selectedConsultation.type === "ONLINE" ? (
                          <FiVideo className="text-purple-500" />
                        ) : (
                          <FiMapPin className="text-purple-500" />
                        )}
                        <span>{selectedConsultation.type} Consultation</span>
                      </div>
                    </div>

                    {/* Schedule Information */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400" />
                        <span>
                          {format(
                            new Date(selectedConsultation.schedule),
                            "PPP"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="text-gray-400" />
                        <span>
                          {format(new Date(selectedConsultation.schedule), "p")}
                        </span>
                      </div>
                    </div>

                    {/* Patient Information */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Patient Information</h4>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <p className="flex items-center gap-2">
                          <FiUser className="text-gray-400" />
                          <span>
                            {selectedConsultation.user?.profile?.fullName}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FiPhone className="text-gray-400" />
                          <span>
                            {selectedConsultation.user?.profile?.phoneNumber}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FiMail className="text-gray-400" />
                          <span>{selectedConsultation.user?.email}</span>
                        </p>
                      </div>
                    </div>

                    {/* Medical Information */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Medical Information</h4>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            Pregnancy Week
                          </p>
                          <p className="font-medium">
                            {selectedConsultation.pregnancyWeek} weeks
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Previous Pregnancies
                          </p>
                          <p className="font-medium">
                            {selectedConsultation.previousPregnancies}
                          </p>
                        </div>
                        {selectedConsultation.symptoms && (
                          <div>
                            <p className="text-sm text-gray-600">Symptoms</p>
                            <p className="font-medium">
                              {selectedConsultation.symptoms}
                            </p>
                          </div>
                        )}
                        {selectedConsultation.concerns && (
                          <div>
                            <p className="text-sm text-gray-600">Concerns</p>
                            <p className="font-medium">
                              {selectedConsultation.concerns}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Payment Information</h4>
                      {renderPaymentInfo()}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      {selectedConsultation.status === "CONFIRMED" && (
                        <button
                          onClick={() => {
                            handleStartConsultation(selectedConsultation.id);
                            setSelectedConsultation(null);
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center gap-2"
                        >
                          <FiMessageCircle />
                          Start Consultation
                        </button>
                      )}

                      {selectedConsultation.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => {
                              handleUpdateStatus(
                                selectedConsultation.id,
                                ConsultationStatus.CONFIRMED
                              );
                              setSelectedConsultation(null);
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 flex items-center gap-2"
                          >
                            <FiCheckCircle />
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              handleUpdateStatus(
                                selectedConsultation.id,
                                ConsultationStatus.CANCELLED
                              );
                              setSelectedConsultation(null);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 flex items-center gap-2"
                          >
                            <FiXCircle />
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedConsultation(null)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sticky footer for actions */}
                <div className="p-6 border-t sticky bottom-0 bg-white rounded-b-2xl">
                  <div className="flex justify-end gap-3">
                    {/* ...existing action buttons... */}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {selectedConsultation && <PaymentProofModal />}
      </div>
    </div>
  );
};

export default DoctorConsultationPage;
