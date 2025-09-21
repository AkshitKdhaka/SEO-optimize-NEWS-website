"use client"

import Image from "next/image"
import Link from "next/link"
import type { NewsArticle } from "@/types/news"
import { useEffect, useRef, useState } from "react"
import { formatDistanceToNow } from "date-fns"

type NewsCardProps = {
  article: NewsArticle
  compact?: boolean
  index?: number
}

export function NewsCard({ article, compact = false, index = 0 }: NewsCardProps) {
  const [isVisible, setIsVisible] = useState(index < 4)
  const cardRef = useRef<HTMLElement>(null)

  const { title, description, url, urlToImage, author, publishedAt, source, category } = article

  // Format the published date as "X time ago"
  const publishedTimeAgo = formatDistanceToNow(new Date(publishedAt), { addSuffix: true })

  // Generate a background color based on the category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "business":
        return "bg-blue-100 dark:bg-blue-900/20"
      case "entertainment":
        return "bg-purple-100 dark:bg-purple-900/20"
      case "general":
        return "bg-gray-100 dark:bg-gray-800"
      case "health":
        return "bg-green-100 dark:bg-green-900/20"
      case "science":
        return "bg-indigo-100 dark:bg-indigo-900/20"
      case "sports":
        return "bg-orange-100 dark:bg-orange-900/20"
      case "technology":
        return "bg-red-100 dark:bg-red-900/20"
      default:
        return "bg-gray-100 dark:bg-gray-800"
    }
  }

  const backgroundColor = getCategoryColor(category)

  useEffect(() => {
    // Skip animation for initially visible cards
    if (index < 3) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    const currentRef = cardRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [index])

  // Create a slug from the title for the URL
  const slug = encodeURIComponent(
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, ""),
  )

  // Build the article URL with all necessary parameters
  const articleUrl = `/article/${slug}?source=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&image=${encodeURIComponent(urlToImage)}&author=${encodeURIComponent(author)}&publishedAt=${encodeURIComponent(publishedAt)}&sourceName=${encodeURIComponent(source.name)}&category=${encodeURIComponent(category)}`

  return (
    <article
      ref={cardRef}
      className={`group relative overflow-hidden rounded-lg ${backgroundColor} h-full transition-transform hover:scale-[1.02] ${
        index < 3
          ? "opacity-100" // No animation for first 3 cards
          : isVisible
            ? "opacity-100 translate-y-0 transition-all duration-1000 ease-out"
            : "opacity-0 translate-y-24 transition-all duration-1000 ease-out"
      }`}
    >
      <Link href={articleUrl} aria-label={title}>
        <div className={`aspect-[16/10] md:aspect-[5/3] w-full relative ${compact ? "max-h-36" : "max-h-48"}`}>
          <Image
            src={urlToImage || "/placeholder.svg?height=400&width=600&text=No+Image"}
            alt={`Featured image for article: ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 3} // Use priority loading for first 3 cards
          />
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        </div>
        <div className={`p-${compact ? "3" : "4"}`}>
          <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 my-1">
            <span>{source.name}</span>
            <span aria-hidden="true"> | </span>
            <time dateTime={new Date(publishedAt).toISOString()}>{publishedTimeAgo}</time>
          </div>
          <h2
            className={`${compact ? "text-xl" : "text-2xl"} font-bold mb-1 group-hover:text-[#00b2ff] line-clamp-2 dark:text-gray-100`}
          >
            {title}
          </h2>
          {!compact && (
            <div className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {description}{" "}
              <span className="inline-block bg-black/10 dark:bg-white/10 px-3 py-1 rounded-full text-xs ml-1 align-middle">
                Read More
              </span>
            </div>
          )}
          {compact && (
            <div className="inline-block bg-black/10 dark:bg-white/10 px-3 py-1 rounded-full text-xs">Read More</div>
          )}
        </div>
      </Link>
    </article>
  )
}
