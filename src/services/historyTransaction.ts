import api from "./api";

export interface Transaction {
  id: string;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  createdAt: string;
  cart: {
    cartProducts: Array<{
      id: string;
      quantity: number;
      product: {
        id: string;
        title: string;
        price: number;
      }
    }>
  };
}

export const historyTransactionService = {
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const { data } = await api.get('/transactions/history');
      console.log('Transaction data received:', data); // Add debugging
      return data;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  },
};