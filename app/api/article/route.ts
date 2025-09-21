import { type NextRequest, NextResponse } from "next/server"

// Force this route to be dynamic since it uses search parameters
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    // In a real implementation, you would fetch the article content here
    // For now, we'll return mock data since we can't actually scrape the content
    // due to CORS restrictions and the complexity of HTML parsing

    const mockArticle = {
      title: searchParams.get("title") || "Article Title",
      content:
        "This is a placeholder for the article content. In a real implementation, you would fetch and parse the actual content from the source.",
      author: searchParams.get("author") || "Unknown Author",
      publishedAt: searchParams.get("publishedAt") || new Date().toISOString(),
      source: searchParams.get("source") || "News Source",
      category: searchParams.get("category") || "general",
      url: url,
      urlToImage: searchParams.get("image") || "/placeholder.svg?height=600&width=1200&text=Article+Image",
    }

    return NextResponse.json(mockArticle)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article", message: (error as Error).message }, { status: 500 })
  }
}
