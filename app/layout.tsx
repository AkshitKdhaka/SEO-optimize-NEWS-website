import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { ClientOnly } from "@/components/client-only"

// Load Nunito font with Latin subset
const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito", // This allows us to use it as a CSS variable
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"], // Include all weights we might need
})

export const metadata: Metadata = {
  title: {
    template: "%s | Global News Network",
    default: "Global News Network - Breaking News and Top Stories",
  },
  description:
    "Stay informed with the latest breaking news, top stories, and in-depth reporting from around the world. Global News Network delivers timely updates on politics, business, technology, entertainment, and more.",
  keywords: "news, breaking news, world news, politics, business, technology, entertainment, sports, health, science",
  authors: [{ name: "Global News Network", url: "https://globalnews.example.com/" }],
  creator: "Global News Network",
  publisher: "Global News Network",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL("https://globalnews.example.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  category: "News",
  openGraph: {
    title: "Global News Network - Breaking News and Top Stories",
    description:
      "Stay informed with the latest breaking news, top stories, and in-depth reporting from around the world.",
    url: "https://globalnews.example.com",
    siteName: "Global News Network",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Global News Network - Breaking News and Top Stories",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global News Network - Breaking News and Top Stories",
    description: "Stay informed with the latest breaking news and top stories",
    images: ["/og-image.jpg"],
    creator: "@GlobalNewsNet",
    site: "@GlobalNewsNet",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Replace with your actual verification code
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className={nunito.variable} suppressHydrationWarning>
      <body className="font-nunito min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var initialTheme = theme || systemTheme;
                  
                  if (initialTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              name: "Global News Network",
              url: "https://globalnews.example.com/",
              logo: "https://globalnews.example.com/logo.png",
              sameAs: [
                "https://www.facebook.com/globalnewsnetwork",
                "https://www.twitter.com/globalnewsnet",
                "https://www.linkedin.com/company/global-news-network",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-555-5555",
                contactType: "customer service",
                email: "info@globalnews.example.com",
                availableLanguage: "English",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 News Street",
                addressLocality: "New York",
                addressRegion: "NY",
                postalCode: "10001",
                addressCountry: "US",
              },
              description:
                "Global News Network provides breaking news, top stories, and in-depth reporting from around the world.",
            }),
          }}
        />
        <ClientOnly>
          <ThemeToggle />
        </ClientOnly>
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
