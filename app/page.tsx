"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { Hero } from "@/components/hero"
import { Navigation } from "@/components/nav"
import { NewsCard } from "@/components/news-card"
import { ApiKeyError } from "@/components/api-key-error"
import Link from "next/link"
import { fetchTopHeadlines, searchNews } from "@/lib/api"
import type { NewsArticle, NewsCategory } from "@/types/news"
import { Loader2, AlertTriangle } from "lucide-react"

export default function Home() {
  const searchParams = useSearchParams()
  const [categoryParam, setCategoryParam] = useState<NewsCategory | null>(null)
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isApiKeyError, setIsApiKeyError] = useState(false)

  const categoryTitle = useMemo(() => {
    if (searchQuery) {
      return `Search Results: ${searchQuery}`
    }

    if (categoryParam) {
      return categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
    }

    return "Latest News"
  }, [categoryParam, searchQuery])

  useEffect(() => {
    const category = searchParams.get("category") as NewsCategory | null
    setCategoryParam(category)
    setPage(1)
  }, [searchParams])

  useEffect(() => {
    const handleCategoryChanged = (event: CustomEvent) => {
      setCategoryParam(event.detail)
      setPage(1)
    }

    window.addEventListener("category-changed", handleCategoryChanged as EventListener)
    return () => window.removeEventListener("category-changed", handleCategoryChanged as EventListener)
  }, [])

  useEffect(() => {
    async function loadNews() {
      setIsLoading(true)
      setError(null)
      setIsApiKeyError(false)

      try {
        let result

        if (searchQuery) {
          result = await searchNews(searchQuery, page)
        } else {
          result = await fetchTopHeadlines(categoryParam || undefined, page)
        }

        if (result.error) {
          if (result.message?.includes("API key") || result.error?.includes("authentication")) {
            setIsApiKeyError(true)
          }
          throw new Error(result.message || "Failed to load news")
        }

        if (page === 1) {
          setArticles(result.articles)
        } else {
          setArticles((prev) => [...prev, ...result.articles])
        }

        setTotalResults(result.totalResults)
      } catch (err) {
        console.error("Error loading news:", err)
        setError((err as Error).message || "Failed to load news. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadNews()
  }, [categoryParam, page, searchQuery])

  if (isApiKeyError) {
    return <ApiKeyError />
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const loadMore = () => {
    if (!isLoading && articles.length < totalResults) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  return (
    <main>
      <Hero onSearch={handleSearch} latestArticles={articles.slice(0, 3)} />
      <Navigation />
      <div className="container mx-auto px-4">
        <header>
          <h1 className="text-2xl font-bold mb-6">{categoryTitle}</h1>
          {categoryParam && (
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex text-sm text-gray-500">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Home
                  </Link>
                  <span className="mx-2">/</span>
                </li>
                <li className="text-primary font-medium">{categoryTitle}</li>
              </ol>
            </nav>
          )}
        </header>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error loading news</p>
              <p className="text-sm">{error}</p>
              {error.includes("API key") && (
                <p className="text-sm mt-2">
                  Please make sure your News API key is correctly set in the environment variables.
                </p>
              )}
            </div>
          </div>
        )}

        {articles.length > 0 ? (
          <section aria-label={`${categoryTitle} news articles`}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {articles.map((article, index) => (
                <NewsCard key={`${article.url}-${index}`} article={article} index={index} />
              ))}
            </div>

            {articles.length < totalResults && (
              <div className="flex justify-center mb-16">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </section>
        ) : !isLoading ? (
          <section aria-label="No articles found" className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">No articles found</h2>
            <p className="text-gray-600">Try selecting a different category or check back later for new content.</p>
          </section>
        ) : null}

        {isLoading && page === 1 && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <section className="my-16 py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-xl font-bold mb-6 dark:text-gray-100">About Our News Platform</h2>
            <p className="mb-4 text-sm dark:text-gray-300">
              Our news platform brings you the latest headlines and stories from around the world. We aggregate content
              from trusted sources to provide you with comprehensive coverage across various categories including
              business, technology, entertainment, sports, and more.
            </p>
            <p className="mb-4 text-sm dark:text-gray-300">
              Stay informed with breaking news, in-depth analysis, and expert opinions on the topics that matter most to
              you. Our platform is designed to deliver a seamless reading experience, allowing you to quickly find and
              consume the news that interests you.
            </p>
            <p className="text-sm dark:text-gray-300">
              Whether you're looking for the latest business trends, technology innovations, or entertainment updates,
              our news platform has you covered with timely and accurate information from reliable sources.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
