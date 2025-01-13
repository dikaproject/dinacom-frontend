import api from './api';
import { AxiosError } from 'axios';
import {
  PregnancyResponse,
  DailyCheckup,
  NutritionLog,
  ExerciseLog,
  AIRecommendation,
  NutritionAnalysis,
  ReminderSettings,
  PasswordUpdateData,
  UpdateResponse,
  HealthInsightResponse
} from '@/types/pregnancy';

export const pregnancyService = {
  // Profile Management
  createProfile: async (formData: FormData) => {
    try {
      const response = await api.post('/pregnancy/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  },

  getProfile: async (silent = false): Promise<PregnancyResponse | null> => {
    try {
      const response = await api.get<PregnancyResponse>('/pregnancy/profile');
      if (!response.data || !response.data.profile) {
        if (!silent) {
          throw new Error('Invalid profile data received');
        }
        return null;
      }
      return response.data;
    } catch (error) {
      if (!silent) {
        if (error instanceof AxiosError && error.response?.data) {
          throw new Error(error.response.data.message);
        }
        throw new Error('Failed to fetch pregnancy profile');
      }
      return null;
    }
  },


  updateProfile: async (formData: FormData): Promise<UpdateResponse> => {
    try {
      const response = await api.put<UpdateResponse>('/pregnancy/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update profile');
    }
  },

  updatePassword: async (passwordData: PasswordUpdateData): Promise<UpdateResponse> => {
    try {
      const response = await api.put<UpdateResponse>('/settings/password', passwordData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update password');
    }
  },

  // Daily Checkup
  createDailyCheckup: async (checkupData: DailyCheckup): Promise<DailyCheckup> => {
    try {
      const response = await api.post<DailyCheckup>('/pregnancy/daily-checkup', checkupData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create daily checkup');
    }
  },

  getDailyCheckups: async (silent = false) => {
    try {
      const response = await api.get<DailyCheckup[]>('/pregnancy/daily-checkup');
      return response.data;
    } catch (error) {
      if (!silent) {
        if (error instanceof AxiosError && error.response?.data) {
          throw new Error(error.response.data.message);
        }
        throw new Error('Failed to fetch daily checkups');
      }
      return [];
    }
  },

  // Nutrition Management
  createNutritionLog: async (nutritionData: NutritionLog): Promise<NutritionLog> => {
    try {
      const response = await api.post<NutritionLog>('/pregnancy/nutrition', nutritionData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create nutrition log');
    }
  },

  getNutritionLogs: async () => {
    try {
      const response = await api.get<NutritionLog[]>('/pregnancy/nutrition');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch nutrition logs');
    }
  },

    analyzeFoodNutrition: async (description: string): Promise<NutritionAnalysis> => {
    try {
      const response = await api.post('/pregnancy/nutrition/analyze', { description });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to analyze food nutrition');
    }
  },

  // Exercise Tracking
  createExerciseLog: async (exerciseData: ExerciseLog): Promise<ExerciseLog> => {
    try {
      const response = await api.post<ExerciseLog>('/pregnancy/exercise', exerciseData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create exercise log');
    }
  },

  getExerciseLogs: async () => {
    try {
      const response = await api.get<ExerciseLog[]>('/pregnancy/exercise');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch exercise logs');
    }
  },

    getAIRecommendations: async (healthData: Record<string, unknown>): Promise<AIRecommendation> => {
    try {
      const response = await api.post<AIRecommendation>(
        '/pregnancy/ai-recommendation/analyze', 
        healthData
      );
      return response.data;
    } catch (error) {
      console.error("AI recommendation error:", error);
      throw error;
    }
  },

  getHealthInsights: async (): Promise<HealthInsightResponse> => {
    try {
      const response = await api.post<HealthInsightResponse>('/pregnancy/ai-recommendation/insights');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to get health insights');
    }
  },

  updateReminderSettings: async (settings: ReminderSettings): Promise<UpdateResponse> => {
    try {
      const response = await api.put<UpdateResponse>('/pregnancy/reminder/settings', settings);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update reminder settings');
    }
  },

  
};