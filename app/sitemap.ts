import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  // Base URL for the site
  const baseUrl = "https://globalnews.live"

  // Current date for lastModified
  const currentDate = new Date()

  // Home page
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ]

  // Category pages
  const categories = ["general", "business", "entertainment", "health", "science", "sports", "technology"]

  categories.forEach((category) => {
    routes.push({
      url: `${baseUrl}/?category=${category}`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })
  })

  return routes
}
