export interface Article {
  id: string;
  thumbnail: string;
  title: string;
  content: string;
  slug: string;
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ArticleFormData {
  title: string;
  content: string;
  slug: string;
  thumbnail?: File;
  categories: string[];
}

