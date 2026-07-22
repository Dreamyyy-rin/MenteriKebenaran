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
  data?: NewsArticle[];
  news?: NewsArticle[];
  total: number;
  page: number;
  totalPages?: number;
  pages?: number;
}

export interface DiscussionItem {
  _id: string;
  newsId: string;
  userId: {
    _id: string;
    fullName: string;
    username: string;
  };
  comment: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}
