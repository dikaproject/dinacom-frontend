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
  thumbnail?: string;
  price: number;
  productStatus: 'ACTIVE' | 'UNACTIVE';
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductDTO {
  title: string;
  slug: string;
  description: string;
  productStatus: 'ACTIVE' | 'UNACTIVE';
  price: number;
  categoryId: string;
  thumbnail?: File;
}
