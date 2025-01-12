import api from './api';
import { TransactionRequest } from '@/types/midtrans';

export const transactionService = {
    createTransaction: async (data: TransactionRequest) => {
        try {
            const response = await api.post('/transaction/midtrans', data);
            return response.data;
        } catch (error) {
            console.error('Create transaction error:', error);
            throw error;
        }
    },
    
    cancelTransaction: async (transactionId: string) => {
        try {
            const response = await api.post(`/transaction/${transactionId}/cancel`);
            return response.data;
        } catch (error) {
            console.error('Cancel transaction error:', error);
            throw error;
        }
    }
};