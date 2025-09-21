"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { NewsCard } from "@/components/news-card"
import { ShareButton } from "@/components/share-button"
import type { NewsArticle } from "@/types/news"
import { fetchTopHeadlines } from "@/lib/api"
import { formatDistanceToNow, format } from "date-fns"

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams()
  const sourceUrl = searchParams.get("source")
  const title = searchParams.get("title") || params.slug.replace(/-/g, " ")
  const image = searchParams.get("image")
  const author = searchParams.get("author")
  const publishedAt = searchParams.get("publishedAt")
  const sourceName = searchParams.get("sourceName")
  const category = searchParams.get("category")

  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticle() {
      if (!sourceUrl) {
        setError("Article not found")
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        // Fetch the article content from our API route
        const apiParams = new URLSearchParams({
          url: sourceUrl,
          title: title || "",
          image: image || "",
          author: author || "",
          publishedAt: publishedAt || "",
          source: sourceName || "",
          category: category || "general",
        })

        const response = await fetch(`/api/article?${apiParams.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch article")
        }

        const articleData = await response.json()

        // Create a NewsArticle object from the response
        const mockArticle: NewsArticle = {
          title: articleData.title,
          description: articleData.description || "No description available",
          content: articleData.content,
          url: articleData.url,
          urlToImage: articleData.urlToImage,
          publishedAt: articleData.publishedAt,
          source: {
            id: null,
            name: articleData.source,
          },
          author: articleData.author,
          category: articleData.category,
        }

        setArticle(mockArticle)

        // Fetch related articles
        const { articles } = await fetchTopHeadlines(mockArticle.category, 1)
        setRelatedArticles(articles.filter((a) => a.url !== sourceUrl).slice(0, 4))
      } catch (err) {
        console.error(err)
        setError("Failed to load article. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [sourceUrl, params.slug, title, image, author, publishedAt, sourceName, category])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <main>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">🤔 Article Not Found</h1>
            <p className="text-lg text-gray-600 mb-6">{error || "We couldn't find the article you're looking for."}</p>
            <Link href="/" className="text-primary hover:underline">
              Return to Homepage
            </Link>
          </div>

          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Articles you may like</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.slice(0, 3).map((relatedArticle, index) => (
                  <NewsCard key={relatedArticle.url} article={relatedArticle} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    )
  }

  const publishedDate = new Date(article.publishedAt)
  const publishedTimeAgo = formatDistanceToNow(publishedDate, { addSuffix: true })
  const formattedDate = format(publishedDate, "MMMM d, yyyy")

  return (
    <main>
      <div className="relative h-[30vh] md:h-[40vh] min-h-[320px] md:min-h-[400px] bg-black">
        <Image
          src={article.urlToImage || "/placeholder.svg"}
          alt={`Featured image for article: ${article.title}`}
          fill
          className="object-cover opacity-70"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0">
          {/* Category above author info */}
          <div className="absolute bottom-12 left-4">
            <span className="bg-black/50 text-white px-2 py-2 text-sm font-medium">
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </span>
          </div>

          {/* Author info in bottom left */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-2 text-xs text-white">
              <span>{article.author}</span>
              <span>|</span>
              <time dateTime={publishedDate.toISOString()}>{publishedTimeAgo}</time>
              <span>|</span>
              <span>{article.source.name}</span>
            </div>
          </div>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12">
        {/* Title below the image */}
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{article.title}</h1>
          <div className="flex justify-end">
            <ShareButton title={article.title} slug={params.slug} />
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p className="text-base font-medium mb-6">{article.description}</p>

            {/* Article content */}
            <div className="my-8">
              <p>{article.content}</p>

              {/* Source attribution */}
              <div className="mt-8 pt-4 border-t text-sm text-gray-500">
                <p>
                  This article was originally published on{" "}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {article.source.name}
                  </a>{" "}
                  on {formattedDate}.
                </p>
              </div>
            </div>
          </div>

          {relatedArticles.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold mb-6">Related Articles</h3>
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((relatedArticle, index) => (
                    <NewsCard key={relatedArticle.url} article={relatedArticle} compact={true} index={index} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Social Media and engagement */}
          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 mb-2">Follow us</h4>
                <div className="flex gap-2">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow on Twitter"
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-blue-400 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow on Facebook"
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow on LinkedIn"
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-700 hover:bg-blue-700 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <Link href="/" className="text-primary hover:underline text-sm">
                  ← Back to all News
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
