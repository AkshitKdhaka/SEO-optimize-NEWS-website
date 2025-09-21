# 🌍 Global News Network

A modern, responsive news aggregation platform built with Next.js 14, TypeScript, and Tailwind CSS. Stay informed with the latest breaking news, top stories, and in-depth reporting from around the world.

![Global News Network](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎯 Core Features
- **Real-time News Aggregation** - Fetches latest news from NewsAPI
- **Category-based Browsing** - Browse news by categories (Business, Technology, Sports, etc.)
- **Advanced Search** - Search for specific news topics and keywords
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme** - Toggle between dark and light modes with system preference detection

### 🎨 User Experience
- **Interactive Hero Carousel** - Featured news stories with auto-rotation
- **Infinite Scroll** - Load more articles seamlessly
- **Article Preview** - Quick preview of articles before reading
- **Social Sharing** - Share articles on WhatsApp, Twitter, and Facebook
- **SEO Optimized** - Meta tags, structured data, and sitemap generation

### 🔧 Technical Features
- **Server-Side Rendering** - Fast initial page loads
- **API Route Handlers** - Secure server-side API integration
- **Image Optimization** - Next.js Image component with lazy loading
- **Error Boundaries** - Graceful error handling
- **TypeScript** - Full type safety throughout the application

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- NewsAPI key (free at [newsapi.org](https://newsapi.org))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AkshitKdhaka/SEO-optimize-NEWS-website.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # NewsAPI Configuration
   NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key_here
   
   # Optional: Server-side key (recommended for production)
   NEWS_API_KEY=your_newsapi_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
global-news-network/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── article/              # Individual article fetching
│   │   └── news/                 # News aggregation endpoint
│   ├── article/[slug]/           # Dynamic article pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── robots.ts                 # SEO robots.txt
│   └── sitemap.ts                # SEO sitemap
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── api-key-error.tsx         # API key error handling
│   ├── blog-card.tsx             # Legacy blog card (unused)
│   ├── client-only.tsx           # Client-side only wrapper
│   ├── footer.tsx                # Site footer
│   ├── hero.tsx                  # Hero carousel component
│   ├── nav.tsx                   # Navigation component
│   ├── news-card.tsx             # News article card
│   ├── share-button.tsx          # Social sharing component
│   └── theme-toggle.tsx          # Dark/light theme toggle
├── contexts/                     # React contexts (legacy)
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
│   ├── api.ts                    # API client functions
│   └── utils.ts                  # General utilities
├── types/                        # TypeScript type definitions
│   └── news.ts                   # News-related types
├── public/                       # Static assets
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.mjs               # Next.js configuration
└── package.json                  # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_NEWS_API_KEY` | NewsAPI key for client-side requests | Yes | - |
| `NEWS_API_KEY` | NewsAPI key for server-side requests (recommended) | No | - |

### NewsAPI Setup

1. Visit [NewsAPI.org](https://newsapi.org)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

**Note:** Free tier has limitations:
- 1,000 requests per day
- Development environment only
- No commercial use

## 🎨 Customization

### Theme Configuration

The project uses Tailwind CSS with custom color schemes defined in \`tailwind.config.ts\`:

```typescript
colors: {
  primary: "#EF4F5F",  // Main brand color
  // ... other colors
}
```

### Adding New Categories

To add new news categories, update the \`categories\` array in \`components/nav.tsx\`:

```typescript
const categories = [
  // ... existing categories
  {
    name: "Your Category",
    href: "/your-category",
    description: "Description for SEO",
    slug: "your-category" as NewsCategory,
  },
]
```

Don't forget to update the \`NewsCategory\` type in \`types/news.ts\`.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Build Commands

```bash
# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Code Style

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting (recommended)
- **TypeScript** for type checking

### Adding New Features

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code patterns
   - Add TypeScript types
   - Update tests if applicable

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Submit a pull request**

## 🐛 Troubleshooting

### Common Issues

#### 1. "News API key is missing" Error
**Solution:** Make sure you've added your NewsAPI key to \`.env.local\`

#### 2. Build Errors with Dynamic Routes
**Solution:** API routes are marked as dynamic with \`export const dynamic = 'force-dynamic'\`

#### 3. Images Not Loading
**Solution:** Check if the news source provides valid image URLs. The app has fallback placeholders.

#### 4. Theme Toggle Not Working
**Solution:** The theme toggle uses client-side rendering. Make sure JavaScript is enabled.

### Debug Mode

Enable debug logging by adding to your \`.env.local\`:
```env
NODE_ENV=development
```

## 📊 Performance

### Optimization Features

- **Image Optimization** - Next.js Image component with lazy loading
- **Code Splitting** - Automatic code splitting by Next.js
- **Caching** - API responses cached for 10 minutes
- **Static Generation** - Static pages where possible
- **Bundle Analysis** - Use \`npm run analyze\` to analyze bundle size

### Performance Tips

1. **API Rate Limiting** - Be mindful of NewsAPI rate limits
2. **Image Optimization** - Images are automatically optimized
3. **Caching Strategy** - API responses are cached server-side
4. **Lazy Loading** - Articles load as you scroll

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Update documentation**
6. **Submit a pull request**

### Contribution Guidelines

- Follow existing code style
- Add TypeScript types for new features
- Update README if adding new features
- Test your changes thoroughly
- Write clear commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NewsAPI** - For providing the news data
- **Next.js Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **shadcn/ui** - For the beautiful UI components
- **Lucide React** - For the icon library

## 📞 Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join our community** discussions

## 🔮 Roadmap

### Upcoming Features

- [ ] User authentication and personalization
- [ ] Bookmark articles for later reading
- [ ] Newsletter subscription
- [ ] Advanced filtering options
- [ ] Offline reading support
- [ ] Push notifications for breaking news
- [ ] Multi-language support
- [ ] RSS feed integration
- [ ] Analytics dashboard
- [ ] Comment system

### Technical Improvements

- [ ] Add comprehensive testing suite
- [ ] Implement PWA features
- [ ] Add database integration
- [ ] Improve accessibility (WCAG compliance)
- [ ] Add monitoring and analytics
- [ ] Implement CI/CD pipeline

---

**Made by the akd**

*Star ⭐ this repository if you found it helpful!*
```
