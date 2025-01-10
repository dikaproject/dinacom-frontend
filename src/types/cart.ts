export interface CartProduct {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    thumbnail: string;
    description: string;
  };
}

export interface Cart {
  id: string;
  userId: string;
  products: CartProduct[];
  totalItems: number;
  totalAmount: number;
}
