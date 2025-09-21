"use client"

import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/data/blog-posts"
import { useEffect, useRef, useState } from "react"

type BlogCardProps = BlogPost & {
  compact?: boolean
  index?: number // Add index prop to identify card position
}

export function BlogCard({
  title,
  excerpt,
  slug,
  coverImage,
  author,
  date,
  readTime,
  backgroundColor,
  category,
  compact = false,
  index = 0, // Default to 0 if not provided
}: BlogCardProps) {
  const [isVisible, setIsVisible] = useState(index < 4) // Pre-set visibility for first 3 cards
  const cardRef = useRef<HTMLElement>(null)

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
      <Link href={`/blog/${slug}`} aria-label={title}>
        <div className={`aspect-[16/10] md:aspect-[5/3] w-full relative ${compact ? "max-h-36" : "max-h-48"}`}>
          <Image
            src={coverImage || "/placeholder.svg"}
            alt={`Featured image for article: ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 3} // Use priority loading for first 3 cards
          />
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-base px-2 py-1">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        </div>
        <div className={`p-${compact ? "3" : "4"}`}>
          <div className="flex items-center gap-1 text-xs text-gray-600 my-1">
            <span>{author}</span>
            <span aria-hidden="true"> | </span>
            <time dateTime={new Date(date).toISOString()}>{date}</time>
            <span aria-hidden="true"> | </span>
            <span>{readTime} read</span>
          </div>
          <h2 className={`${compact ? "text-xl" : "text-2xl"} font-bold mb-1 group-hover:text-[#00b2ff]`}>{title}</h2>
          {!compact && (
            <div className="text-gray-600 text-sm">
              {excerpt}{" "}
              <span className="inline-block bg-black/10 px-3 py-1 rounded-full text-xs ml-1 align-middle">
                Learn More
              </span>
            </div>
          )}
          {compact && <div className="inline-block bg-black/10 px-3 py-1 rounded-full text-xs">Learn More</div>}
        </div>
      </Link>
    </article>
  )
}
