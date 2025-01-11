import api from './api';
import { Product } from '@/types/shop';

export const shopService = {
  getAllProducts: async (params?: {
    minPrice?: number;
    maxPrice?: number;
    categoryId?: string;
  }): Promise<Product[]> => {
    try {
      const response = await api.get('/product', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
};