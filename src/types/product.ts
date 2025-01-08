export interface Category {
  id: string;
  name: string;
  description?: string;
  products?: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  productStatus: string;
  categoryId: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}
