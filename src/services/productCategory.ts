import api from './api';
import { ProductCategory } from '@/types/productCategory';

export const productCategoryService = {
    getAll: async (): Promise<ProductCategory[]> => {
        try {
            const response = await api.get('/product-category');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getById: async (id: string): Promise<ProductCategory> => {
        try {
            const response = await api.get(`/product-category/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    create: async (data: { name: string; slug: string }): Promise<ProductCategory> => {
        try {
            const response = await api.post('/product-category', data);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    update: async (id: string, data: ProductCategory): Promise<ProductCategory> => {
        try {
            const response = await api.put(`/product-category/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/product-category/${id}`);
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};
