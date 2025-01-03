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

  registerDoctor: async (doctorData: DoctorRegistration): Promise<AuthResponse> => {
    try {
      const formData = new FormData();
      
      // Add basic fields
      const basicFields = [
        'email', 'password', 'fullName', 'strNumber', 
        'sipNumber', 'phoneNumber', 'provinsi', 'kabupaten',
        'kecamatan', 'address', 'codePos', 'layananKesehatanId',
        'educationBackground'
      ];

      basicFields.forEach(field => {
        if (doctorData[field as keyof DoctorRegistration]) {
          formData.append(field, doctorData[field as keyof DoctorRegistration] as string);
        }
      });

      // Add file fields
      if (doctorData.photoProfile) {
        formData.append('photoProfile', doctorData.photoProfile);
      }
      if (doctorData.documentsProof) {
        formData.append('documentsProof', doctorData.documentsProof);
      }

      const response = await api.post('/auth/register-doctor', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response?.status === 400) {
        const message = axiosError.response.data?.message;
        if (message?.includes('Missing required fields')) {
          throw new Error(message);
        }
        throw new Error('Email already exists');
      }
      throw new Error(axiosError.response?.data?.message || 'Doctor registration failed');
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