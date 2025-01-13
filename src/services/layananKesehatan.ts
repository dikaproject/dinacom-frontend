import api from './api';
import { LayananKesehatan } from '@/types/layananKesehatan';

export const layananKesehatanService = {
  getAll: async (): Promise<LayananKesehatan[]> => {
    try {
      const { data } = await api.get('/layanan-kesehatan');
      return data;
    } catch (error) {
      console.error('Error fetching layanan kesehatan:', error);
      throw error;
    }
  }
};