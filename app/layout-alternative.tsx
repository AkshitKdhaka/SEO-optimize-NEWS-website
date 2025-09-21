import type React from "react"
import { Nunito } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { ThemeToggleFallback } from "@/components/theme-toggle-fallback"

const nunito = Nunito({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className={nunito.variable} suppressHydrationWarning>
      <body className="font-nunito min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeToggleFallback />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
