import api from './api';
import { AxiosError } from 'axios';
import { 
  Doctor, 
  DoctorSchedule, 
  ConsultationForm,
  PaymentDetails 
} from '@/types/consultation';

export const consultationService = {
  getDoctors: async () => {
    try {
      const response = await api.get<{ doctors: Doctor[] }>('/doctors');
      return response.data.doctors;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch doctors');
      }
      throw error;
    }
  },

  getDoctorSchedules: async (doctorId: string) => {
    try {
      const response = await api.get<{ schedules: DoctorSchedule[] }>(
        `/doctor-schedules/doctor/${doctorId}`
      );
      return response.data.schedules;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch doctor schedules');
      }
      throw error;
    }
  },

  createConsultation: async (data: ConsultationForm) => {
    try {
      const response = await api.post('/consultations', data);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to create consultation');
      }
      throw error;
    }
  },

  createPayment: async (consultationId: string, paymentMethod: string) => {
    try {
      const response = await api.post<{ data: PaymentDetails }>(
        '/payments', 
        { consultationId, paymentMethod }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to process payment');
      }
      throw error;
    }
  }
};