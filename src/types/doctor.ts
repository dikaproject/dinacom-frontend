export interface DoctorSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DoctorProfile {
  id: string;
  consultationFee: number;
  schedules: DoctorSchedule[];
}

export interface DoctorStatistics {
    todayAppointments: number;
    activePatients: number;
    pendingConsultations: number;
    monthlyEarnings: number;
    activityData: {
      date: string;
      total: number;
      completed: number;
      pending: number;
    }[];
  }
  
  export interface DoctorProfile {
  id: string;
  fullName: string;
  strNumber: string;
  sipNumber: string;
  phoneNumber: string;
  photoProfile?: string;
  documentsProof?: string;
  consultationFee: number;
  schedules: DoctorSchedule[];
  layananKesehatan: {
    id: string;
    name: string;
    district: string;
  };
  email: string;
  province: string;
  city: string;
  district: string;
  address: string;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  codePos: string;
  educationBackground: string;
}

export interface DoctorStatistics {
  todayAppointments: number;
  activePatients: number;
  pendingConsultations: number;
  monthlyEarnings: number;
  activityData: {
    date: string;
    total: number;
    completed: number;
    pending: number;
  }[];
}

export interface PatientProfile {
  fullName: string;
  pregnancyWeek: number;
}

export interface PatientConsultation {
  id: string;
  schedule: string;
  status: string;
  type: string;
}

export interface Patient {
  id: string;
  profile: PatientProfile;
  consultations: PatientConsultation[];
}

