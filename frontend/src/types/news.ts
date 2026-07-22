export interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  artikel: string;
  foto?: string;
  category?: string;
  tags?: string[];
  author?: {
    _id: string;
    fullName: string;
    username: string;
  };
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse {
  news: NewsArticle[];
  total: number;
  page: number;
  pages: number;
}
