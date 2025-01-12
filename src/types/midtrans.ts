export interface MidtransResult {
  order_id: string;
  transaction_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_status: string;
  transaction_time: string;
}

export interface TransactionRequest {
  cartId: string;
  shippingAddressId: string;
  amount: number;
}