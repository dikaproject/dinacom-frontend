export interface Product {
  id: string;
  thumbnail: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
}