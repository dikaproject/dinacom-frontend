import api from './api';
import { User, LoginCredentials, RegisterCredentials, DoctorRegistration } from '@/types/auth';
import { AxiosError } from 'axios';

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface ApiError {
  message: string;
  status?: number;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response?.status === 401) {
        throw new Error('Invalid credentials');
      }
      throw new Error(axiosError.response?.data?.message || 'Login failed');
    }
  },

  register: async (userData: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const { email, password } = userData;
      const response = await api.post('/auth/register', { 
        email, 
        password,
        role: 'USER'
      });
      
      // If the response data is not in expected format, try to normalize it
      const normalized = {
        message: response.data.message || 'Registration successful',
        token: response.data.token || response.data.access_token || '',
        user: response.data.user || response.data.userData || null
      };

      // Validate minimum required data
      if (!normalized.token || !normalized.user) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Invalid response from server');
      }

      return normalized;
    } catch (error) {
      console.error("Register Error Details:", error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message 
          || error.response?.data?.error 
          || 'Registration failed';
        throw new Error(errorMessage);
      }
      throw error; // Re-throw unexpected errors
    }
  },

  registerDoctor: async (doctorData: FormData): Promise<AuthResponse> => {
    try {
      // Add validation for required files
      const photoProfile = doctorData.get('photoProfile');
      const documentsProof = doctorData.get('documentsProof');

      if (!photoProfile) {
        throw new Error('Profile photo is required');
      }

      if (!documentsProof) {
        throw new Error('Documentation proof is required');
      }

      const response = await api.post('/auth/register-doctor', doctorData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message 
          || error.response?.data?.error 
          || 'Doctor registration failed';
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getAuthToken: (): string | null => {
    return localStorage.getItem('token');
  },

  setAuthToken: (token: string): void => {
    localStorage.setItem('token', token);
  }
};