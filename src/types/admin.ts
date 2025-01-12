export interface Doctor {
  id: string;
  fullName: string;
  email: string;
  strNumber: string;
  sipNumber: string;
  phoneNumber: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  address: string;
  codePos: string;
  educationBackground: string;
  layananKesehatanId: string;
  photoProfile: string | null;
  documentsProof: string | null;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  user: {
    email: string;
    role: string;
  };
  layananKesehatan: {
    id: string;
    name: string;
  };
}

export interface LayananKesehatan {
  id: string;
  name: string;
  type: string;
  noIzin: string;
  phoneNumber: string;
  email: string;
  province: string;
  city: string;
  district: string;
  address: string;
  codePos: string;
}