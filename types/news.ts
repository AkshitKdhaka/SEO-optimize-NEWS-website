export interface NewsArticle {
  title: string
  description: string
  content: string
  url: string
  urlToImage: string
  publishedAt: string
  source: {
    id: string | null
    name: string
  }
  author: string
  category: string
}

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

export type NewsCategory =
  | "general"
  | "business"
  | "entertainment"
  | "health"
  | "science"
  | "sports"
  | "technology"
  | "all"
