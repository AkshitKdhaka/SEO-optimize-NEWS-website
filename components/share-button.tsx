"use client"

import { useState, useRef } from "react"
import { Share, Copy, X, Check } from "lucide-react"

interface ShareButtonProps {
  title: string
  slug: string
}

export function ShareButton({ title, slug }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const closeDropdown = () => {
    setIsOpen(false)
  }

  const shareUrl = `https://blog.geniuslabs.edu/blog/${slug}`
  const encodedTitle = encodeURIComponent(title)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)

    // Clear existing timer if any
    if (timerRef.current) clearTimeout(timerRef.current)

    // Reset copied state after 2 seconds
    timerRef.current = setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const shareLinks = [
    {
      name: "WhatsApp",
      url: `https://wa.me/?text=${encodedTitle}%20${encodeURIComponent(shareUrl)}`,
      bgColor: "#25D366",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodedTitle}`,
      bgColor: "#1DA1F2",
      icon: (
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
      ),
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      bgColor: "#1877F2",
      icon: (
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
      ),
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
        aria-label="Share this post"
      >
        <Share size={14} />
        <span>Share</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50 border">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium">Share this blog</h4>
            <button
              onClick={closeDropdown}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close sharing menu"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex gap-2 mb-3 justify-center">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${link.name}`}
                className="w-10 h-10 flex items-center justify-center rounded-full text-white transition-colors"
                style={{ backgroundColor: link.bgColor }}
              >
                {link.icon}
              </a>
            ))}
          </div>

          <div className="flex items-center border rounded overflow-hidden">
            <input type="text" value={shareUrl} readOnly className="w-full text-xs px-2 py-1.5 outline-none" />
            <button
              onClick={copyToClipboard}
              className="bg-gray-100 hover:bg-gray-200 px-2 py-1.5 transition-colors"
              title="Copy link"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
