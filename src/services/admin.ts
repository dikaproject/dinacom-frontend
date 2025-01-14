import api from './api';
import { Doctor, LayananKesehatan } from '@/types/admin';

interface CreateDoctorData {
    email: string;
    password: string;
    fullName: string;
    strNumber: string;
    sipNumber: string;
    phoneNumber: string;
    provinsi: string;
    kabupaten: string;
    kecamatan: string;
    address: string;
    codePos: string;
    layananKesehatanId: string;
    educationBackground: string;
    photoProfile?: File;
    documentsProof?: File;
  }
  
  interface UpdateDoctorData extends Omit<CreateDoctorData, 'password'> {
    id: string;
  }

interface DashboardStats {
  totalDoctors: number;
  doctorsGrowth: number;
  totalUsers: number;
  usersGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
  totalProducts: number;
  productsGrowth: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  status: string;
  amount: number;
  date: string;
}

interface RecentUser {
  id: string;
  name: string;
  joinDate: string;
  status: string;
  avatar?: string;
}

interface DoctorSchedule {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export const adminService = {
  getDoctors: async (): Promise<Doctor[]> => {
    try {
      const { data } = await api.get('/admin/doctors');
      return data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  deleteDoctor: async (id: string) => {
    try {
      const { data } = await api.delete(`/admin/doctors/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }
  },

  createDoctor: async (data: CreateDoctorData) => {
  try {
    const formData = new FormData();
    
    // Add files first
    if (data.photoProfile) {
      formData.append('photoProfile', data.photoProfile);
    }
    if (data.documentsProof) {
      formData.append('documentsProof', data.documentsProof);
    }

    // Remove undefined/null values and files before adding other fields
    const { photoProfile, documentsProof, ...otherData } = data;
    Object.entries(otherData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await api.post('/admin/doctors', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
},

verifyDoctor: async (doctorId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const { data } = await api.patch(`/admin/doctors/${doctorId}/verify`, { status });
      return data;
    } catch (error) {
      console.error('Error verifying doctor:', error);
      throw error;
    }
  },

  updateDoctor: async (data: UpdateDoctorData) => {
    try {
      const formData = new FormData();
      const { id, photoProfile, documentsProof, ...restData } = data;

      // Add files if they exist
      if (photoProfile instanceof File) {
        formData.append('photoProfile', photoProfile);
      }
      if (documentsProof instanceof File) {
        formData.append('documentsProof', documentsProof);
      }

      // Add rest of the data
      Object.entries(restData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await api.put(`/admin/doctors/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating doctor:', error);
      throw error;
    }
  },

  getDoctorById: async (id: string): Promise<Doctor> => {
    try {
      const { data } = await api.get(`/admin/doctors/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching doctor:', error);
      throw error;
    }
  },

  getHealthcareProviders: async (): Promise<LayananKesehatan[]> => {
    try {
      const { data } = await api.get('/layanan-kesehatan');
      return data;
    } catch (error) {
      console.error('Error fetching healthcare providers:', error);
      throw error;
    }
  },

  getAnalytics: async (timeRange: string = 'month') => {
    try {
      const { data } = await api.get(`/admin/analytics?timeRange=${timeRange}`);
      return data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const { data } = await api.get('/admin/dashboard/stats');
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getRecentOrders: async (page: number = 1): Promise<RecentOrder[]> => {
    try {
      const { data } = await api.get(`/admin/dashboard/orders?page=${page}`);
      return data;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  },

  getRecentUsers: async (): Promise<RecentUser[]> => {
    try {
      const { data } = await api.get('/admin/dashboard/recent-users');
      return data;
    } catch (error) {
      console.error('Error fetching recent users:', error);
      throw error;
    }
  },

  getDoctorSchedules: async (): Promise<DoctorSchedule[]> => {
    try {
      const { data } = await api.get('/admin/dashboard/doctor-schedules');
      return data;
    } catch (error) {
      console.error('Error fetching doctor schedules:', error);
      throw error;
    }
  },
};