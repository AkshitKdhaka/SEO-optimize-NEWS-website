"use client"

import type React from "react"
import type { NewsArticle } from "@/types/news"
import { useState, useEffect, useCallback } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

interface CarouselSlide {
  id: number
  background: string
  alt: string
  title: string
  article?: NewsArticle
}

interface HeroProps {
  onSearch: (query: string) => void
  latestArticles?: NewsArticle[]
}

export function Hero({ onSearch, latestArticles = [] }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Create slides from latest articles or use default slides
  const slides: CarouselSlide[] =
    latestArticles.length > 0
      ? latestArticles.slice(0, 3).map((article, index) => ({
          id: index + 1,
          background: article.urlToImage
            ? `url('${article.urlToImage}')`
            : `url('/placeholder.svg?height=600&width=1200&text=Breaking+News')`,
          alt: article.title,
          title: article.title,
          article: article,
        }))
      : [
          {
            id: 1,
            background: "url('/blog1.jpg?height=600&width=1200')",
            alt: "Breaking news and top headlines from around the world",
            title: "Breaking News",
          },
          {
            id: 2,
            background: "url('/blog2.jpg?height=600&width=1200&text=Slide+2')",
            alt: "Business and financial news updates",
            title: "Business News",
          },
          {
            id: 3,
            background: "url('/blog3.webp?height=600&width=1200&text=Slide+3')",
            alt: "Technology innovations and digital trends",
            title: "Technology News",
          },
        ]

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  const handleSlideClick = useCallback(
    (slide: CarouselSlide) => {
      if (slide.article) {
        // Create article URL
        const slug = encodeURIComponent(
          slide.article.title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, ""),
        )

        const articleUrl = `/article/${slug}?source=${encodeURIComponent(slide.article.url)}&title=${encodeURIComponent(slide.article.title)}&image=${encodeURIComponent(slide.article.urlToImage)}&author=${encodeURIComponent(slide.article.author)}&publishedAt=${encodeURIComponent(slide.article.publishedAt)}&sourceName=${encodeURIComponent(slide.article.source.name)}&category=${encodeURIComponent(slide.article.category)}`

        // Use App Router navigation
        router.push(articleUrl)
      }
    },
    [router],
  )

  return (
    <section
      aria-label="Featured content carousel"
      className="relative h-[40vh] md:h-[50vh] min-h-[320px] md:min-h-[400px] overflow-hidden"
    >
      {/* Carousel slides */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform cursor-pointer hover:scale-105 ${
              currentSlide === index
                ? "opacity-100 translate-x-0"
                : index < currentSlide || (currentSlide === 0 && index === slides.length - 1)
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
            } bg-cover bg-center bg-gray-800`}
            style={{
              backgroundImage: slide.background,
            }}
            aria-hidden={currentSlide !== index}
            role="img"
            aria-label={slide.alt}
            onClick={() => handleSlideClick(slide)}
          >
            <div className="absolute inset-0 bg-black/60 flex items-end p-6">
              {slide.article && (
                <div className="text-white max-w-2xl">
                  <h3 className="text-2xl font-bold mb-2 line-clamp-2">{slide.article.title}</h3>
                  <p className="text-sm opacity-90 line-clamp-2">{slide.article.description}</p>
                  <div className="flex items-center gap-2 text-xs mt-2 opacity-75">
                    <span>{slide.article.source.name}</span>
                    <span>•</span>
                    <span>{new Date(slide.article.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Latest News Carousel */}
      <div className="absolute inset-0 flex items-start justify-center pt-8 z-20 pointer-events-none">
        <div className="w-full max-w-6xl px-4">
          {/* Current slide content */}
          <div className="text-center text-white mb-8">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Latest Breaking News</h2>
            <p className="text-lg md:text-xl opacity-90">Stay informed with real-time updates</p>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-20 pointer-events-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search for news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 px-6 pr-14 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm text-white placeholder-white/80 focus:outline-none focus:ring-4 focus:ring-primary/50 focus:bg-white/30 shadow-lg text-lg font-medium"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all duration-200"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10" role="tablist">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index ? "w-4 bg-primary" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            aria-selected={currentSlide === index}
            role="tab"
          />
        ))}
      </div>
    </section>
  )
}
