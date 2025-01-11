import api from './api';
import { Product } from '@/types/product';

export const productService = {
    getAll: async (): Promise<Product[]> => {
        try {
            const response = await api.get('/product');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getById: async (id: string): Promise<Product> => {
        try {
            const response = await api.get(`/product/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    create: async (formData: FormData): Promise<Product> => {
        try {
            const response = await api.post('/product', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    update: async (id: string, formData: FormData): Promise<Product> => {
        try {
            const response = await api.put(`/product/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/product/${id}`);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
};
