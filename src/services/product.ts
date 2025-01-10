import api from './api';
import { Product, CreateProductDTO } from '@/types/product';

export const productService = {
    getAll: async (): Promise<Product[]> => {
        try {
            const response = await api.get('/product');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
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

    create: async (data: CreateProductDTO): Promise<Product> => {
        try {
            const formData = new FormData();
            
            formData.append('title', data.title);
            formData.append('slug', data.slug);
            formData.append('description', data.description);
            formData.append('productStatus', data.productStatus);
            formData.append('price', String(data.price));
            formData.append('categoryId', data.categoryId);

            if (data.thumbnail) {
                formData.append('thumbnail', data.thumbnail);
            }

            const response = await api.post('/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    update: async (id: string, data: Partial<CreateProductDTO>): Promise<Product> => {
        try {
            const formData = new FormData();
            
            Object.keys(data).forEach((key) => {
                if (key !== 'thumbnail') {
                    formData.append(key, String(data[key as keyof CreateProductDTO]));
                }
            });

            if (data.thumbnail) {
                formData.append('thumbnail', data.thumbnail);
            }

            const response = await api.put(`/product/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.product; // Match backend response structure
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
