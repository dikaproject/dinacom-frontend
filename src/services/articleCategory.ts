import api from './api';
import { ArticleCategory, ArticleCategoryFormData } from '@/types/articleCategory';

export const articleCategoryService = {
    getAll: async (): Promise<ArticleCategory[]> => {
        try {
            const response = await api.get('/article-category');
            // Add type checking and data transformation
            if (!Array.isArray(response.data)) {
                // If response.data is not an array but has a data property that is an array
                if (response.data.data && Array.isArray(response.data.data)) {
                    return response.data.data;
                }
                // If response is not in expected format, return empty array
                console.error('Unexpected response format:', response.data);
                return [];
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getById: async (id: string): Promise<ArticleCategory> => {
        try {
            const response = await api.get(`/article-category/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    create: async (data: ArticleCategoryFormData): Promise<ArticleCategory> => {
        try {
            const response = await api.post('/article-category', {
                name: data.name,
                slug: data.slug,
            });
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    update: async (id: string, data: ArticleCategoryFormData): Promise<ArticleCategory> => {
        try {
            const response = await api.put(`/article-category/${id}`, {
                name: data.name,
                slug: data.slug
            });
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await api.delete(`/article-category/${id}`);
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};
