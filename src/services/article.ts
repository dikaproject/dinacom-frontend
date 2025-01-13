import api from './api';
import { Article, ArticleFormData } from '@/types/article';

export const articleService = {
  getAll: async (): Promise<Article[]> => {
    const response = await api.get('/article');
    return response.data;
  },

  getById: async (id: string): Promise<Article> => {
    try {
      const response = await api.get(`/article/${id}`);
      console.log('Article response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },

  create: async (data: ArticleFormData): Promise<Article> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('slug', data.slug);

    const categoryData = data.categories.map(slug => ({ slug }));
    formData.append('categories', JSON.stringify(categoryData));
    
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
    try {
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
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/article/${id}`);
  }
};
