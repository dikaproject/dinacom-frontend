export type PaymentMethod = 'BANK_TRANSFER' | 'QRIS' | 'MIDTRANS';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';

export interface PaymentDetails {
  payment: {
    id: string;
    amount: number;
    platformFee: number;
    tax: number;
    totalAmount: number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    expiredAt: string;
  };
  guide?: {
    bankInfo?: {
      bankName: string;
      accountNumber: string;
      accountHolder: string;
    };
    steps: string[];
  };
  qrisUrl?: string;
  snapToken?: string;
  breakdown: {
    consultationFee: number;
    platformFee: number; // Changed from serviceCharge
    tax: number;
    total: number;
  };
}

export interface PaymentResponse {
    success: boolean;
    data: PaymentDetails;
    message?: string;
  }
  
  export interface PaymentProofResponse {
    message: string;
    data: {
      id: string;
      paymentProof: string;
      paymentStatus: PaymentStatus;
    };
  }

  