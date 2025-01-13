import api from './api';
import { UserAdmin, UserAdminFormData } from '@/types/userAdmin';

export const userAdminService = {
  getAll: async (): Promise<UserAdmin[]> => {
    try {
      // Sesuaikan dengan route di backend: /api/user-admin/users
      const response = await api.get('/user-admin/users');
      console.log('Users response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getAll users:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<UserAdmin> => {
    const response = await api.get(`/user-admin/users/${id}`);
    return response.data;
  },

  create: async (data: UserAdminFormData): Promise<UserAdmin> => {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    const response = await api.post('/user-admin/users', {
      email: data.email,
      password: data.password,
      role: data.role
    });
    return response.data;
  },

  update: async (id: string, data: Partial<UserAdminFormData>): Promise<UserAdmin> => {
    try {
        const updateData = {
            email: data.email,
            role: data.role,
            currentPassword: data.currentPassword,
            ...(data.password && { password: data.password })
        };

        const response = await api.put(`/user-admin/users/${id}`, updateData);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to update user';
        throw new Error(message);
    }
},

  delete: async (id: string): Promise<void> => {
    await api.delete(`/user-admin/users/${id}`);
  }
};
