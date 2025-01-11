import api from './api';
import { PaymentMethod, PaymentResponse, PaymentProofResponse } from '@/types/payment';

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: SnapOptions) => void;
    };
  }
}

interface MidtransResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  payment_type: string;
}

interface SnapOptions {
  onSuccess: (result: MidtransResult) => void;
  onPending: (result: MidtransResult) => void;
  onError: (result: MidtransResult) => void;
  onClose: () => void;
}

export const paymentService = {
    createPayment: async (consultationId: string, paymentMethod: PaymentMethod) => {
        try {
          const response = await api.post<PaymentResponse>(
            '/payments',
            { consultationId, paymentMethod }
          );
    
          return response.data;
        } catch (err) {
          console.error('Payment creation error:', err);
          throw new Error('Failed to create payment');
        }
      },
    
      uploadPaymentProof: async (paymentId: string, file: File) => {
        try {
          const formData = new FormData();
          formData.append('paymentProof', file);
    
          const response = await api.post<PaymentProofResponse>(
            `/payments/${paymentId}/proof`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );
    
          return response.data;
        } catch (err) {
          console.error('Payment proof upload error:', err);
          throw new Error('Failed to upload payment proof');
        }
      },
      processMidtransPayment: async (consultationId: string) => {
        try {
          console.log('Processing Midtrans payment for consultation:', consultationId);
          
          const response = await api.post('/payments/midtrans', {
            consultationId
          });
          
          if (!response.data.success) {
            throw new Error(response.data.message || 'Payment failed');
          }
      
          console.log('Midtrans payment response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Midtrans payment error:', error);
          throw error;
        }
      }
};