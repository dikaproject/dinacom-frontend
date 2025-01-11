export interface ConsultationHistory {
    id: string;
    type: 'ONLINE' | 'OFFLINE';
    schedule: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    symptoms?: string;
    concerns?: string;
    pregnancyWeek: number;
    previousPregnancies: number;
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
      platformFee: number;
      tax: number;
      totalAmount: number;
      paymentMethod: string;
    };
    createdAt: string;
    updatedAt: string;
  }
  
export interface ChatMessage {
  id: string;
  consultationId: string;
  content: string;
  senderId: string;
  sender: {
    email: string;
    role: string;
    doctor?: {
      fullName: string;
      photoProfile?: string;
    };
    profile?: {
      fullName: string;
      photoProfile?: string;
    };
  };
  isRead: boolean;
  createdAt: string;
}

export interface ChatRoom {
  consultation: ConsultationHistory;
  messages: ChatMessage[];
  chatEnabled: boolean;
  isDoctor: boolean;
}