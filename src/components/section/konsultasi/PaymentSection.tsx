/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

// Add MidtransStatus import at the top
import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ConsultationContext } from './Konsultasi';
import { ConsultationContextType } from '@/types/consultation';
import { PaymentMethod, PaymentDetails } from '@/types/payment';
import { paymentService } from '@/services/payment';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import MidtransStatus from './MidtransStatus'; // Add this import
import { 
  FiCreditCard, 
  FiDollarSign, 
  FiUpload,
  FiCheckCircle 
} from 'react-icons/fi';

interface MidtransStatusProps {
  status: 'success' | 'pending' | 'error';
  transaction?: {
    orderId: string;
    amount: number;
    date: string;
  };
}


interface PaymentSectionProps {
  nextStep: () => void;
  prevStep: () => void;
}

export default function PaymentSection({ nextStep, prevStep }: PaymentSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const { consultationData, setConsultationData } = useContext(ConsultationContext) as ConsultationContextType;
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [midtransStatus, setMidtransStatus] = useState<'success' | 'pending' | 'error' | null>(null);
const [transactionDetails, setTransactionDetails] = useState<MidtransStatusProps['transaction']>(undefined);

const handleCreatePayment = async () => {
  try {
    setIsProcessing(true);
    const response = await paymentService.createPayment(
      consultationData.consultationId!,
      selectedMethod
    );
    
    setPaymentDetails(response.data);
    setPaymentProcessed(true); // Lock payment method after processing
    setConsultationData({
      ...consultationData,
      paymentMethod: selectedMethod
    });
      
      if (selectedMethod === 'MIDTRANS' && response.data.snapToken) {
        window.snap?.pay(response.data.snapToken, {
          onSuccess: () => nextStep(),
          onPending: () => {},
          onError: () => toast.error('Payment failed'),
          onClose: () => {}
        });
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      toast.error('Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);

  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const handleUploadProof = async () => {
    if (!paymentProof || !paymentDetails?.payment?.id) {
      toast.error('Please select a file to upload');
      return;
    }
  
    try {
      setIsProcessing(true);
      const response = await paymentService.uploadPaymentProof(
        paymentDetails.payment.id,
        paymentProof
      );
  
      if (response.message) {
        toast.success(response.message);
        nextStep();
      }
    } catch (err) {
      console.error('Payment proof upload error:', err);
      toast.error('Failed to upload payment proof');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMidtransPayment = async () => {
    try {
      setIsProcessing(true);
      // Change to use specific Midtrans endpoint
      const response = await paymentService.processMidtransPayment(
        consultationData.consultationId!
      );
      
      if (!response.data?.snapToken) {
        throw new Error('Failed to get Midtrans token');
      }


      if (typeof window.snap === 'undefined') {
        toast.error('Midtrans is not initialized');
        return;
      }

          
      window.snap.pay(response.data.snapToken, {
        onSuccess: function(result: any) {
          setMidtransStatus('success');
          setTransactionDetails({
            orderId: result.order_id,
            amount: result.gross_amount,
            date: new Date().toLocaleString()
          });
          nextStep();
        },
        onPending: function(result: any) {
          setMidtransStatus('pending');
          setTransactionDetails({
            orderId: result.order_id,
            amount: result.gross_amount,
            date: new Date().toLocaleString()
          });
        },
        onError: function(result: any) {
          setMidtransStatus('error');
          toast.error('Payment failed: ' + (result.message || 'Unknown error'));
        },
        onClose: function() {
          setIsProcessing(false);
          if (!midtransStatus) {
            toast.error('Payment cancelled');
          }
        }
      });
    } catch (error) {
      console.error('Midtrans payment error:', error);
      toast.error('Failed to initialize payment');
      setMidtransStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectMidtrans = () => {
    setSelectedMethod('MIDTRANS');
  };

  return (
    <>
    {midtransStatus ? (
      <MidtransStatus 
        status={midtransStatus} 
        transaction={transactionDetails}
      />
    ) : (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Consultation Summary */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <h3 className="font-medium text-purple-800 mb-4">Consultation Summary</h3>
        <div className="space-y-2 text-purple-600">
          <p>Doctor: Dr. {consultationData.doctorName}</p>
          <p>Type: {consultationData.type === 'ONLINE' ? 'Online Consultation' : 'Hospital Visit'}</p>
          <p>Schedule: {new Date(consultationData.schedule!).toLocaleString()}</p>
        </div>
      </div>

      {/* Price Breakdown */}
      {paymentDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="font-medium text-gray-800 mb-4">Price Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Consultation Fee</span>
              <span>{formatIDR(paymentDetails.breakdown.consultationFee)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
  <span>Platform Fee</span>
  <span>{formatIDR(paymentDetails.breakdown.platformFee)}</span>
</div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>{formatIDR(paymentDetails.breakdown.tax)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-medium">
              <span>Total Amount</span>
              <span>{formatIDR(paymentDetails.breakdown.total)}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!paymentProcessed ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod('BANK_TRANSFER')}
                disabled={paymentProcessed}
                className={`p-6 rounded-lg border ${
                  selectedMethod === 'BANK_TRANSFER'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                } ${paymentProcessed ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiDollarSign className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h4 className="font-medium text-gray-800">Bank Transfer</h4>
                <p className="text-sm text-gray-500 mt-1">Manual bank transfer</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod('QRIS')}
                disabled={paymentProcessed}
                className={`p-6 rounded-lg border ${
                  selectedMethod === 'QRIS'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                } ${paymentProcessed ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Image
                  src="/qris-icon.jpg"
                  alt="QRIS"
                  width={32}
                  height={32}
                  className="mx-auto mb-3"
                />
                <h4 className="font-medium text-gray-800">QRIS</h4>
                <p className="text-sm text-gray-500 mt-1">Pay with any QRIS-supported app</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSelectMidtrans}
                disabled={paymentProcessed}
                className={`p-6 rounded-lg border ${
                  selectedMethod === 'MIDTRANS'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                } ${paymentProcessed ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiCreditCard className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                <h4 className="font-medium text-gray-800">Credit Card / E-Wallet</h4>
                <p className="text-sm text-gray-500 mt-1">Via Midtrans</p>
              </motion.button>
            </>
          ) : (
            <div className="col-span-3 p-6 rounded-lg border border-purple-500 bg-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Selected Payment Method: {selectedMethod.replace('_', ' ')}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Payment is being processed. Please complete the payment according to the instructions.
                  </p>
                </div>
                <FiCheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Instructions */}
      {paymentDetails?.guide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h4 className="font-medium text-gray-800 mb-4">Payment Instructions</h4>
          
          {selectedMethod === 'BANK_TRANSFER' && paymentDetails.guide.bankInfo && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-700">{paymentDetails.guide.bankInfo.bankName}</p>
              <p className="text-gray-600">{paymentDetails.guide.bankInfo.accountNumber}</p>
              <p className="text-gray-600">{paymentDetails.guide.bankInfo.accountHolder}</p>
            </div>
          )}

{selectedMethod === 'QRIS' && (
  <div className="mb-4 flex justify-center">
    <Image
      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/qris.jpeg`}
      alt="QRIS Code"
      width={200}
      height={200}
      className="rounded-lg"
    />
  </div>
)}

          <ol className="space-y-2">
            {paymentDetails.guide.steps.map((step, index) => (
              <li key={index} className="flex text-gray-700 items-start">
                <span className="font-medium text-gray-700 mr-2">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ol>

          {selectedMethod === 'BANK_TRANSFER' && (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-600">Upload payment proof after completing the transfer:</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="payment-proof"
              />
              <label
                htmlFor="payment-proof"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <FiUpload className="mr-2" />
                Choose File
              </label>
              {paymentProof && (
                <p className="text-sm text-green-600 flex items-center">
                  <FiCheckCircle className="mr-2" />
                  {paymentProof.name}
                </p>
              )}
            </div>
          )}
           {selectedMethod === 'QRIS' && (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-600">Upload payment proof after completing the transfer:</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="payment-proof"
              />
              <label
                htmlFor="payment-proof"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <FiUpload className="mr-2" />
                Choose File
              </label>
              {paymentProof && (
                <p className="text-sm text-green-600 flex items-center">
                  <FiCheckCircle className="mr-2" />
                  {paymentProof.name}
                </p>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          onClick={prevStep}
          disabled={isProcessing}
          className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Back
        </button>

        {!paymentDetails ? (
          <button
            onClick={handleCreatePayment}
            disabled={isProcessing}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Process Payment'}
          </button>
        ) : selectedMethod === 'BANK_TRANSFER' ? (
          <button
            onClick={handleUploadProof}
            disabled={!paymentProof || isProcessing}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Uploading...' : 'Submit Payment Proof'}
          </button>
        ) : selectedMethod === 'QRIS' ? (
          <button
            onClick={handleUploadProof}
            disabled={!paymentProof || isProcessing}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Uploading...' : 'Submit Payment Proof'}
          </button>
        ) : selectedMethod === 'MIDTRANS' ? (
          <button
            onClick={handleMidtransPayment}
            disabled={isProcessing}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Pay with Midtrans'}
          </button>
        ) : null}
      </div>
    </div>
    )}
    </> 
  );
}