import type { NewsArticle } from "@/types/news"

/**
 * Fetch top headlines from our server-side API route
 */
export async function fetchTopHeadlines(
  category?: string,
  page = 1,
): Promise<{ articles: NewsArticle[]; totalResults: number; error?: string; message?: string }> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
    })

    if (category && category !== "all") {
      params.append("category", category)
    }

    const response = await fetch(`/api/news?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      return {
        articles: [],
        totalResults: 0,
        error: data.error || `API error: ${response.status}`,
        message: data.message || "Failed to fetch news",
      }
    }

    return data
  } catch (error) {
    console.error("Error fetching news:", error)
    return {
      articles: [],
      totalResults: 0,
      error: "Network error",
      message: (error as Error).message,
    }
  }
}

/**
 * Search for news articles using our server-side API route
 */
export async function searchNews(
  query: string,
  page = 1,
): Promise<{ articles: NewsArticle[]; totalResults: number; error?: string; message?: string }> {
  try {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
    })

    const response = await fetch(`/api/news?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      return {
        articles: [],
        totalResults: 0,
        error: data.error || `API error: ${response.status}`,
        message: data.message || "Failed to fetch news",
      }
    }

    return data
  } catch (error) {
    console.error("Error searching news:", error)
    return {
      articles: [],
      totalResults: 0,
      error: "Network error",
      message: (error as Error).message,
    }
  }
}
