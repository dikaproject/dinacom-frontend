export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
}

export type ArticleCategoryFormData = {
  name: string;
  slug: string;
};
