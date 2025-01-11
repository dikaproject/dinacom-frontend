import api from './api';
import { AxiosError } from 'axios';
import { 
  Doctor, 
  DoctorSchedule, 
  ConsultationForm,
  PaymentDetails,
  ConsultationHistory,
  ChatMessage
} from '@/types/consultation';

export enum ConsultationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export interface PendingConsultation {
  id: string;
  doctor: {
    fullName: string;
  };
  schedule: string;
  type: 'ONLINE' | 'OFFLINE';
  payment: {
    amount: number;
    status: string;
  };
}

export interface ScheduleAvailability {
  time: string;
  isAvailable: boolean;
  reason?: 'BOOKED' | 'PASSED' | 'PENDING';
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  reason?: 'BOOKED' | 'PASSED' | 'PENDING';
}

export const consultationService = {
    getDoctors: async () => {
        try {
          const response = await api.get<{ doctors: Doctor[] }>('/doctor/doctors');
          
          // Add response validation
          if (!response.data || !Array.isArray(response.data.doctors)) {
            throw new Error('Invalid response format from server');
          }
          
          console.log('Doctors fetched:', response.data.doctors); // Debug log
          return response.data.doctors;
        } catch (error: unknown) {
          console.error('Error fetching doctors:', error); // Detailed error logging
          if (error instanceof AxiosError) {
            throw new Error(
              error.response?.data?.message || 
              `Failed to fetch doctors: ${error.message}`
            );
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

  getDoctorAvailableSchedules: async (doctorId: string, date: string) => {
  try {
    const response = await api.get<{ timeSlots: TimeSlot[] }>(
      `/doctor/schedules/${doctorId}/available`, // Updated endpoint
      { params: { date } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
},
  
  cancelConsultation: async (consultationId: string) => {
    try {
      const response = await api.post<{ message: string }>(
        `/consultation/${consultationId}/cancel` // Changed from consultations to consultation
      );
      return response.data;
    } catch (error) {
      console.error('Error canceling consultation:', error);
      throw error;
    }
  },

  checkPendingConsultation: async () => {
    try {
      const response = await api.get<{ data: PendingConsultation }>('/consultation/pending');
      return response.data;
    } catch (error) {
      console.error('Error checking pending consultation:', error);
      throw error;
    }
  },

  createConsultation: async (data: ConsultationForm) => {
    try {
      // Ensure schedule is in proper ISO format
      const scheduleDate = new Date(data.schedule);
      if (isNaN(scheduleDate.getTime())) {
        throw new Error('Invalid schedule format');
      }
  
      const response = await api.post('/consultation', {
        ...data,
        schedule: scheduleDate.toISOString() // Format as ISO string
      });
  
      const consultationId = response.data.data.consultation.id;
      return { ...response.data, consultationId };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Create consultation error:', error.response?.data);
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
  },

  getConsultations: async () => {
    try {
      const response = await api.get<ConsultationHistory[]>('/consultation');
      return response.data;
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
  },

  getAllConsultationsByStatus: async () => {
    try {
      const response = await api.get<{ data: ConsultationHistory[] }>('/consultation/doctor');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor consultations:', error);
      throw error;
    }
  },

  updateConsultationStatus: async (consultationId: string, status: ConsultationStatus) => {
    try {
      const response = await api.put<{ message: string; data: ConsultationHistory }>(
        `/consultation/${consultationId}`,
        { status }
      );
      
      // Refresh the page data after successful update
      if (response.data.data.payment) {
        response.data.data.payment.paymentStatus = status === ConsultationStatus.CONFIRMED ? 'PAID' : 'PENDING';
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating consultation status:', error);
      throw error;
    }
  },

  getUserConsultations: async () => {
    try {
      const response = await api.get<ConsultationHistory[]>('/consultation');
      return response.data;
    } catch (error) {
      console.error('Error fetching user consultations:', error);
      throw error;
    }
  },

  getUserConsultationById: async (consultationId: string) => {
    try {
      const response = await api.get<{
        consultation: ConsultationHistory;
        messages: ChatMessage[];
        chatEnabled: boolean;
      }>(`/consultation/${consultationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching consultation:', error);
      throw error;
    }
  },

  startConsultation: async (consultationId: string) => {
    try {
      // Always use the messages endpoint for chat
      const endpoint = `/messages/consultation/${consultationId}/chat`;
      const response = await api.get<{
        consultation: ConsultationHistory;
        messages: ChatMessage[];
        chatEnabled: boolean;
      }>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error starting consultation:', error);
      throw error;
    }
  }
};