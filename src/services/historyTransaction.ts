import api from "./api";

export interface Transaction {
  id: string;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  createdAt: string;
  products: string; // Change this to store products as text
}

export const historyTransactionService = {
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const { data } = await api.get('/transactions/history');
      // Transform the data to include products as text
      const transformedData = data.map((transaction: any) => ({
        ...transaction,
        products: transaction.cart.cartProducts
          .map(item => `${item.product.title} (${item.quantity})`)
          .join(', ')
      }));
      return transformedData;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      throw error;
    }
  },
};