export interface CartProduct {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  basePrice: number; // Add this
  subtotal: number; // Add this
  product: {
    id: string;
    title: string;
    price: number;
    thumbnail: string | null;
    description: string;
  };
}


export interface ShippingAddress {
  id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface CartSummary {
  subtotal: number;
  platformFee: number;
  tax: number;
  shippingCost: number;
  total: number;
}

export interface Cart {
  id: string;
  userId: string;
  products: CartProduct[];
  totalItems: number;
  totalAmount: number;
}
