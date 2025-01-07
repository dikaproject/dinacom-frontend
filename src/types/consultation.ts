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