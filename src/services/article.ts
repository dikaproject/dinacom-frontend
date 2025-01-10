import api from './api';
import { Article, ArticleFormData } from '@/types/article';

export const articleService = {
  getAll: async (): Promise<Article[]> => {
    const response = await api.get('/article');
    return response.data;
  },

  getById: async (id: string): Promise<Article> => {
    const response = await api.get(`/article/${id}`);
    return response.data;
  },

  create: async (data: ArticleFormData): Promise<Article> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('categories', JSON.stringify(data.categories));
    
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }

    const response = await api.post('/article', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: ArticleFormData): Promise<Article> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('categories', JSON.stringify(data.categories));
    
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }

    const response = await api.put(`/article/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/article/${id}`);
  }
};
