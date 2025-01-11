export interface DoctorSchedule {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    bookedDates?: string[];
  }
  
  export interface Doctor {
    id: string;
    userId: string;
    fullName: string;
    specialization: string;
    experience: string;
    rating: number;
    available: boolean;
    image: string;
    schedules: DoctorSchedule[];
    consultationFee: number;
    layananKesehatan: {
      id: string;
      name: string;
      district: string;
    };
  }export interface DoctorSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  bookedDates?: string[];
}

export interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
  experience: string;
  rating: number;
  available: boolean;
  image: string;
  schedules: DoctorSchedule[];
  consultationFee: number;
  layananKesehatan: {
    id: string;
    name: string;
    district: string;
  };
}

export interface ConsultationForm {
  doctorId: string;
  schedule: string;
  type: 'ONLINE' | 'OFFLINE';
  pregnancyWeek: number;
  previousPregnancies: number;
  symptoms: string;
  concerns?: string;
  medicalHistory?: string;
  location?: string;
  files?: File[];
}

export interface PaymentDetails {
  payment: {
    id: string;
    amount: number;
    serviceCharge: number;
    tax: number;
    totalAmount: number;
    status: string;
  };
  guide?: {
    bankInfo?: {
      bankName: string;
      accountNumber: string;
      accountHolder: string;
    };
    steps: string[];
  };
  snapToken?: string;
}

export interface ConsultationData {
  doctorId: string;
  doctorName: string;
  consultationFee: number;
  consultationId?: string;
  type: 'ONLINE' | 'OFFLINE';
  schedule?: string;
  layananKesehatan: {
    id: string;
    name: string;
    district: string;
  };
  paymentMethod?: 'BANK_TRANSFER' | 'QRIS' | 'MIDTRANS';
  paymentStatus?: string;
  transactionId?: string;
}

export interface ConsultationContextType {
  consultationData: ConsultationData;
  setConsultationData: (data: Partial<ConsultationData>) => void;
}

import { ConsultationStatus } from "@/services/consultation";

interface UserProfile {
  fullName: string;
  phoneNumber: string;
}

interface User {
  id: string; // Add this field
  email: string;
  profile: UserProfile;
}

export interface ConsultationHistory {
  id: string;
  status: ConsultationStatus;
  type: "ONLINE" | "OFFLINE";
  schedule: string;
  pregnancyWeek: number;
  previousPregnancies: number;
  symptoms?: string;
  concerns?: string;
  user: User;
  doctor?: {
    userId: string; // Add this field
    id: string;
    fullName: string;
  };
  payment?: {
    id: string;
    amount: number;
    paymentStatus: string;
    paymentProof?: string;
    paymentMethod?: string;
  };
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