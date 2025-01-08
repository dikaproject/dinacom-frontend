import api from './api';
import { Article } from '@/types/article';

export const articleService = {
    getAll: async (): Promise<Article[]> => {
        try {
            const response = await api.get('/article');
            return response.data;
        } catch (error) {
            console.error('Error fetching articles:', error);
            throw error;
        }
    },

    getById: async (id: string): Promise<Article> => {
        try {
            const response = await api.get(`/article/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching article:', error);
            throw error;
        }
    },

    create: async (data: Article): Promise<Article> => {
        try {
            const response = await api.post('/article', data);
            return response.data;
        } catch (error) {
            console.error('Error creating article:', error);
            throw error;
        }
    },

    update: async (id: string, data: Article): Promise<Article> => {
        try {
            const response = await api.put(`/article/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating article:', error);
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/article/${id}`);
        } catch (error) {
            console.error('Error deleting article:', error);
            throw error;
        }
    }
};
