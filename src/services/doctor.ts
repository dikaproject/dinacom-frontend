import api from './api';
import { AxiosError } from 'axios';
import { DoctorProfile, DoctorSchedule, DoctorStatistics, PatientConsultation, Patient } from '@/types/doctor';



export const doctorService = {
    getProfile: async () => {
        try {
          const response = await api.get<DoctorProfile>('/doctor/profile');
          return response.data;
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            console.error('Profile fetch error:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
          }
          throw error;
        }
      },
    
      getStatistics: async (): Promise<DoctorStatistics> => {
        try {
          const response = await api.get<DoctorStatistics>('/doctor/statistics');
          if (!response.data) {
            throw new Error('No statistics data received');
          }
          return response.data;
        } catch (error: unknown) {
          console.error('Statistics error:', error);
          return {
            todayAppointments: 0,
            activePatients: 0,
            pendingConsultations: 0,
            monthlyEarnings: 0,
            activityData: [] // Add default empty array for activityData
          };
        }
      },

      getWeeklyActivity: async () => {
        try {
          const response = await api.get('/doctor/weekly-activity');
          return response.data;
        } catch (error) {
          console.error('Weekly activity error:', error);
          return null;
        }
      },

      createSchedule: async (schedules: Partial<DoctorSchedule>[]) => {
        try {
          const response = await api.post('/doctor-schedules/create', { schedules });
          return response.data;
        } catch (err: unknown) {
          console.error('Create schedule error:', err);
          throw new Error('Failed to create schedule');
        }
      },
    
      updateSchedule: async (schedule: { dayOfWeek: number; startTime: string; endTime: string }) => {
        try {
          const response = await api.put('/doctor-schedules/update', schedule);
          return response.data;
        } catch (err: unknown) {
          console.error('Update schedule error:', err);
          throw new Error('Failed to update schedule');
        }
      },

  updateConsultationFee: async (fee: number) => {
    try {
      const response = await api.put('/doctor/consultation-fee', { fee });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to update fee');
      }
      throw error;
    }
  },

  updateOrCreateSchedule: async (schedule: { dayOfWeek: number; startTime: string; endTime: string }) => {
    try {
      const response = await api.put('/doctor-schedules/update', schedule);
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        // If schedule doesn't exist, create it
        const response = await api.post('/doctor-schedules/create', {
          schedules: [{
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            isAvailable: true
          }]
        });
        return response.data;
      }
      throw err;
    }
  },

  getPatients: async (): Promise<Patient[]> => {
    try {
      const response = await api.get<Patient[]>('/doctor/patients');
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  getPatientDetails: async (patientId: string): Promise<Patient> => {
    try {
      const response = await api.get<Patient>(`/doctor/patients/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient details:', error);
      throw error;
    }
  },

  getPatientConsultations: async (patientId: string): Promise<PatientConsultation[]> => {
    try {
      const response = await api.get<PatientConsultation[]>(`/doctor/patients/${patientId}/consultations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient consultations:', error);
      throw error;
    }
  },
  
  getDoctorAppointments: async () => {
    try {
      const response = await api.get('/doctor/appointments');
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  updateProfile: async (formData: FormData) => {
    try {
      const response = await api.put('/settings/doctor/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await api.put('/settings/doctor/password', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to change password');
      }
      throw error;
    }
  },
  
  // Add validation helper
  validatePasswordChange: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      throw new Error('All password fields are required');
    }
    if (data.newPassword !== data.confirmPassword) {
      throw new Error('New passwords do not match');
    }
    if (data.newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  },
};