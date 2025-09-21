"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useCallback } from "react"
import type { NewsCategory } from "@/types/news"

// Define navigation categories with improved SEO attributes
const categories: { name: string; href: string; description: string; slug: NewsCategory }[] = [
  {
    name: "All News",
    href: "/",
    description: "View all news articles across all categories",
    slug: "all",
  },
  {
    name: "General",
    href: "/general",
    description: "General news from around the world",
    slug: "general",
  },
  {
    name: "Business",
    href: "/business",
    description: "Business and financial news",
    slug: "business",
  },
  {
    name: "Technology",
    href: "/technology",
    description: "Latest technology news and innovations",
    slug: "technology",
  },
  {
    name: "Entertainment",
    href: "/entertainment",
    description: "Entertainment and celebrity news",
    slug: "entertainment",
  },
  {
    name: "Sports",
    href: "/sports",
    description: "Sports news and updates",
    slug: "sports",
  },
  {
    name: "Science",
    href: "/science",
    description: "Science news and discoveries",
    slug: "science",
  },
  {
    name: "Health",
    href: "/health",
    description: "Health and wellness news",
    slug: "health",
  },
]

export function Navigation() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentCategory = (searchParams.get("category") as NewsCategory) || "all"

  const handleCategoryClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, categoryName: string, categorySlug: NewsCategory) => {
      e.preventDefault()

      // Navigate to appropriate URL based on category
      if (categoryName === "All News") {
        // For "All News", use a custom approach to ensure client-side navigation
        // Create a new URLSearchParams without the category parameter
        const newSearchParams = new URLSearchParams(searchParams.toString())
        newSearchParams.delete("category")

        // Use shallow routing to update the URL without a full page reload
        router.push(`/?${newSearchParams.toString()}`, { scroll: false })

        // Force a re-render by dispatching a custom event
        window.dispatchEvent(new CustomEvent("category-changed", { detail: null }))
      } else if (categorySlug) {
        router.push(`/?category=${categorySlug}`, { scroll: false })
      }
    },
    [router, searchParams],
  )

  return (
    <nav aria-label="News categories" className="border-b border-gray-200 dark:border-gray-700 mb-2">
      <div className="container mx-auto overflow-x-auto scrollbar-hide">
        <ul className="flex space-x-2 py-4">
          {categories.map((category) => {
            // Determine if this category is currently active
            const isActive =
              (category.name === "All News" && !currentCategory) || (category.slug && category.slug === currentCategory)

            return (
              <li key={category.name}>
                <Link
                  href={category.href}
                  onClick={(e) => handleCategoryClick(e, category.name, category.slug)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap pr-6",
                    isActive
                      ? "text-primary border-b-2 border-primary -mb-[17px] pb-4"
                      : "text-muted-foreground dark:text-gray-400",
                  )}
                  aria-current={isActive ? "page" : undefined}
                  title={category.description}
                >
                  {category.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
