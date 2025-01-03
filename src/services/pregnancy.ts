import api from './api';
import { AxiosError } from 'axios';
import {
  PregnancyProfile,
  PregnancyResponse,
  DailyCheckup,
  NutritionLog,
  ExerciseLog,
  AIRecommendation
} from '@/types/pregnancy';

export const pregnancyService = {
  // Profile Management
  createProfile: async (profileData: PregnancyProfile): Promise<PregnancyResponse> => {
    try {
      const response = await api.post<PregnancyResponse>('/pregnancy/profile', profileData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create pregnancy profile');
    }
  },

  getProfile: async (): Promise<PregnancyProfile> => {
    try {
      const response = await api.get<PregnancyResponse>('/pregnancy/profile');
      return response.data.profile;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch pregnancy profile');
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

  getDailyCheckups: async () => {
    try {
      const response = await api.get<DailyCheckup[]>('/pregnancy/daily-checkup');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch daily checkups');
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
};