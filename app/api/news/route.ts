import { type NextRequest, NextResponse } from "next/server"
import type { NewsArticle } from "@/types/news"

// Force this route to be dynamic since it uses search parameters
export const dynamic = "force-dynamic"

// API configuration
// Use process.env directly instead of NEXT_PUBLIC_ prefix for server components
// Prefer a secure server-side key (NEWS_API_KEY).
// Fall back to NEXT_PUBLIC_NEWS_API_KEY for local/dev convenience.
const API_KEY = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY || ""
const BASE_URL = "https://newsapi.org/v2"

// Default parameters for API requests
const DEFAULT_PARAMS = {
  language: "en",
  pageSize: 20,
}

export async function GET(request: NextRequest) {
  try {
    // Check if API key is available
    if (!API_KEY) {
      console.error("News API key is missing")
      return NextResponse.json(
        {
          error: "API configuration error",
          message:
            "News API key is missing. Set NEWS_API_KEY (preferred) or NEXT_PUBLIC_NEWS_API_KEY in your environment variables.",
        },
        { status: 500 },
      )
    }

    const { searchParams } = request.nextUrl
    const category = searchParams.get("category")
    const query = searchParams.get("query")
    const page = searchParams.get("page") || "1"

    let endpoint: string
    const params = new URLSearchParams({
      ...DEFAULT_PARAMS,
      page,
      apiKey: API_KEY,
    })

    if (query) {
      // Search endpoint
      endpoint = `${BASE_URL}/everything`
      params.append("q", query)
    } else {
      // Top headlines endpoint
      endpoint = `${BASE_URL}/top-headlines`
      params.append("country", "us") // Default to US news

      if (category && category !== "all") {
        params.append("category", category)
      }
    }

    // Log the request URL for debugging (without the API key)
    const debugUrl = `${endpoint}?${new URLSearchParams({
      ...Object.fromEntries(params.entries()),
      apiKey: "HIDDEN",
    }).toString()}`
    console.log(`Fetching news from: ${debugUrl}`)

    const response = await fetch(`${endpoint}?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 600 }, // Cache for 10 minutes
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`API error: ${response.status}`, errorData)

      if (response.status === 401) {
        return NextResponse.json(
          {
            error: "API authentication error",
            message: "Invalid API key. Please check your News API key configuration.",
          },
          { status: 401 },
        )
      }

      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      articles: data.articles.map(formatArticle),
      totalResults: data.totalResults,
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news", message: (error as Error).message }, { status: 500 })
  }
}

/**
 * Format API response to match our NewsArticle type
 */
function formatArticle(article: any): NewsArticle {
  return {
    title: article.title || "Untitled Article",
    description: article.description || "No description available",
    content: article.content || article.description || "No content available",
    url: article.url || "#",
    urlToImage: article.urlToImage || "/placeholder.svg?height=400&width=600&text=No+Image",
    publishedAt: article.publishedAt || new Date().toISOString(),
    source: {
      id: article.source?.id || null,
      name: article.source?.name || "Unknown Source",
    },
    author: article.author || "Unknown Author",
    category: "general", // Default category, will be overridden when fetching by category
  }
}
