# Open edX Marketplace

A modern, responsive web application for discovering and exploring Open edX extensions. Built with React, TypeScript, and Tailwind CSS, this marketplace provides a comprehensive platform for educators, developers, and administrators to find the perfect extensions for their Open edX installations.

## 🚀 Features

### Core Functionality
- **🔍 Advanced Search**: Real-time search with debounced queries (300ms) across extension names, descriptions, and providers
- **📊 Smart Filtering**: Filter by category, compatibility, license, and pricing with instant results
- **📱 Responsive Design**: Mobile-first approach with beautiful UI across all devices
- **⚡ High Performance**: Lighthouse score ≥ 90 with optimized loading and skeleton states
- **🎯 Category Navigation**: Organized by Platform Add-ons, External Tools (LTI), and Operational Services

### Extension Discovery
- **📋 Rich Extension Cards**: Thumbnail images, ratings, compatibility badges, and quick actions
- **📖 Detailed Pages**: Complete descriptions, screenshot carousels, installation guides, and provider information
- **🏷️ Smart Badges**: Visual indicators for extension type, pricing, and compatibility
- **⭐ Rating System**: Community ratings and review counts for informed decisions
- **📊 Pagination**: Clean pagination with 20 extensions per page

### Developer Experience
- **🔧 TypeScript**: Full type safety with comprehensive interfaces
- **🎨 Modern UI**: shadcn/ui components with custom design system
- **📦 Component Architecture**: Modular, reusable components for easy maintenance
- **🎭 Loading States**: Skeleton loaders for optimal user experience

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Markdown**: react-markdown for rich content
- **Icons**: Lucide React
- **State Management**: React hooks with local state

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd open-edx-marketplace

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:8080`

## 📊 Data Management

### Registry Structure
Extensions are stored in `public/registry.json` following this schema:

```json
{
  "extensions": [
    {
      "name": "Extension Name",
      "slug": "extension-slug",
      "type": "platform-addon|external-tool|operational-service",
      "latest_version": "1.0.0",
      "core_compat": ["olive", "palm", "quince"],
      "description_short": "Brief description",
      "description_long": "# Markdown content",
      "provider": {
        "name": "Provider Name",
        "url": "https://provider.com",
        "logo": "https://example.com/logo.png"
      },
      "repo_url": "https://github.com/...",
      "license": "MIT",
      "price": "free|paid",
      "rating_avg": 4.5,
      "rating_count": 100,
      "install_notes": "# Installation instructions",
      "screenshots": ["https://example.com/screenshot1.jpg"]
    }
  ]
}
```

### Adding New Extensions

1. **Edit Registry**: Add new extension objects to `public/registry.json`
2. **Image Requirements**: 
   - Screenshots: 16:9 aspect ratio, minimum 800x450px
   - Provider logos: 32x32px, square format
3. **Content Guidelines**:
   - Use Markdown for `description_long` and `install_notes`
   - Keep `description_short` under 150 characters
   - Ensure `slug` is unique and URL-friendly

### Sample Extension Entry
```json
{
  "name": "Analytics Dashboard Pro",
  "slug": "analytics-dashboard-pro",
  "type": "platform-addon",
  "latest_version": "2.1.4",
  "core_compat": ["olive", "palm", "quince"],
  "description_short": "Advanced learning analytics and insights dashboard for educators.",
  "description_long": "# Analytics Dashboard Pro\n\nComprehensive analytics...",
  "provider": {
    "name": "EduTech Solutions",
    "url": "https://edutech-solutions.com",
    "logo": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=32&h=32&fit=crop&crop=face"
  },
  "repo_url": "https://github.com/edutech/analytics-dashboard-pro",
  "license": "AGPL-3.0",
  "price": "paid",
  "rating_avg": 4.8,
  "rating_count": 127,
  "install_notes": "# Installation\n\n1. Install via pip:\n```bash\npip install...",
  "screenshots": [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop"
  ]
}
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── ExtensionCard.tsx # Extension grid card
│   ├── FilterBar.tsx    # Search and filter controls
│   ├── SearchBar.tsx    # Debounced search input
│   ├── Pagination.tsx   # Page navigation
│   └── LoadingSkeleton.tsx # Loading states
├── pages/               # Route components
│   ├── Index.tsx        # Main marketplace page
│   ├── ExtensionDetail.tsx # Individual extension page
│   └── NotFound.tsx     # 404 error page
├── types/               # TypeScript definitions
│   └── extension.ts     # Extension interfaces
├── lib/                 # Utility functions
│   └── utils.ts         # Tailwind utilities
└── hooks/               # Custom React hooks
    └── use-mobile.tsx   # Mobile detection
```

## 🎨 Design System

### Color Palette
- **Primary**: Modern blue (`hsl(217 91% 60%)`) for CTAs and highlights
- **Accent**: Educational green (`hsl(142 76% 36%)`) for success states
- **Background**: Clean light theme with subtle gradients
- **Typography**: Balanced contrast for accessibility (WCAG AA compliant)

### Component Variants
- **Buttons**: Primary, secondary, outline, and ghost variants
- **Badges**: Category-specific colors with proper contrast
- **Cards**: Hover effects with subtle shadows and transforms
- **Loading States**: Skeleton loaders matching component layouts

## 📈 Performance Optimizations

- **Lazy Loading**: Route-based code splitting
- **Image Optimization**: Proper sizing and aspect ratios
- **Debounced Search**: 300ms delay to reduce API calls
- **Efficient Filtering**: Memoized filter functions
- **Skeleton Loading**: Perceived performance improvements
- **Static Assets**: Registry served from public directory

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Test production build locally
npm run preview
```

### Deployment Options

**Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Netlify**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18+

**Static Hosting**
The built application in `dist/` can be served from any static hosting provider.

## 🔧 Configuration

### Environment Variables
No environment variables required - all configuration is static.

### Build Configuration
- **Vite Config**: `vite.config.ts`
- **TypeScript**: `tsconfig.json`
- **Tailwind**: `tailwind.config.ts`
- **ESLint**: `eslint.config.js`

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Test on multiple screen sizes
- Ensure accessibility compliance
- Update registry.json for new extensions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: GitHub Issues for bug reports and feature requests
- **Documentation**: This README and inline code comments
- **Community**: Open edX Community forums for general questions

## 🔮 Next Steps & Roadmap

### Potential Enhancements
- **Dark Mode Toggle**: Theme switching capability
- **Real API Integration**: Connect to live extension registry
- **User Authentication**: Provider accounts and submission flow
- **Advanced Analytics**: Usage tracking and popular extensions
- **Review System**: User ratings and detailed reviews
- **Installation Automation**: Direct integration with Open edX instances
- **Dependency Management**: Extension compatibility checking
- **Favorites System**: Bookmark extensions for later
- **Export Functionality**: Download extension lists
- **Multi-language Support**: Internationalization (i18n)

### Quick Implementation Prompts
- "Add dark mode toggle with theme persistence"
- "Implement user favorites with local storage"
- "Create extension comparison table feature"
- "Add advanced filtering with multi-select options"
- "Implement real-time extension status monitoring"
- "Add provider dashboard for extension management"
