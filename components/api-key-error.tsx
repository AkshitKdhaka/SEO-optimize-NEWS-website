import Link from "next/link"

export function ApiKeyError() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border dark:border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">API Key Configuration Error</h1>

        <div className="mb-6 text-gray-700 dark:text-gray-300">
          <p className="mb-4">
            There seems to be an issue with your News API key. The API returned a 401 Unauthorized error, which
            typically means:
          </p>

          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Your API key is invalid or has expired</li>
            <li>You've exceeded your API request quota</li>
            <li>The API key doesn't have permission for the requested endpoint</li>
          </ul>

          <p className="mb-4">To fix this issue, please make sure you have:</p>

          <ol className="list-decimal pl-5 mb-4 space-y-2">
            <li>
              Signed up for a News API account at{" "}
              <a
                href="https://newsapi.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                newsapi.org
              </a>
            </li>
            <li>Copied your API key from the News API dashboard</li>
            <li>
              Added the API key to your environment variables as{" "}
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">NEXT_PUBLIC_NEWS_API_KEY</code>
            </li>
          </ol>

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
            <p className="font-medium mb-2">Example .env.local file:</p>
            <pre className="text-sm overflow-x-auto">NEXT_PUBLIC_NEWS_API_KEY=your_api_key_here</pre>
          </div>

          <p>After updating your API key, restart your development server for the changes to take effect.</p>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Retry Home Page
          </Link>
        </div>
      </div>
    </div>
  )
}
