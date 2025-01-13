export interface LayananKesehatan {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'CLINIC' | 'HEALTH_CENTER';
  noIzin: string;
  phoneNumber: string;
  email: string;
  province: string;
  city: string;
  district: string;
  address: string;
  codePos: string;
  createdAt: Date;
  updatedAt: Date;
  doctors?: Doctor[];
}

export interface Doctor {
  id: string;
  fullName: string;
  strNumber: string;
  sipNumber: string;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  layananKesehatanId: string;
}