export interface CartProduct {
  id: string;
  productId: string;
  cartId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export interface Cart {
  id: string;
  userId: string;
  products: CartProduct[];
}
