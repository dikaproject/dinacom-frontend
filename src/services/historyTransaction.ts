import api from "./api";

export interface Transaction {
  id: string;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  createdAt: string;
  products: string; // Already formatted string from backend
}

export const historyTransactionService = {
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const { data } = await api.get('/transactions/history');
      return data; // Backend now sends pre-formatted data
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  },
};