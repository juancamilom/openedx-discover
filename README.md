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
- **Data Fetching**: TanStack React Query for caching and async state
- **Backend**: Supabase (reviews and ratings aggregation)

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
      "name": "string",
      "slug": "string",
      "category": "platform-native|platform-connector|courseware-native|courseware-connector",
      "type": "string",
      "latest_version": "string",
      "core_compat": ["redwood", "sumac", "teak"],
      "description_short": "string",
      "description_long": "markdown string",
      "provider_id": "string",
      "repo_url": "string",
      "license": "MIT|AGPLv3|...",
      "price": "free|paid",
      "install_notes": "markdown string",
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
  "name": "EOX core",
  "slug": "eox-core",
  "category": "platform-native",
  "type": "Backend only functionality",
  "latest_version": "",
  "core_compat": [],
  "description_short": "EOX-core (A.K.A. eduNEXT Open extensions) is an Open edX plugin that adds multiple API endpoints to extend the platform without modifying core code.",
  "description_long": "# EOX core\n\nEOX-core (A.K.A. eduNEXT Open extensions) is an Open edX plugin that adds multiple API endpoints in order to extend the functionality of the Open edX platform and avoid changing the base code directly. These API endpoints include bulk creation of pre-activated users and enrollments.",
  "provider_id": "edunext",
  "repo_url": "",
  "license": "AGPLv3",
  "price": "free",
  "install_notes": "",
  "screenshots": [
    "https://www.edunext.co/wp-content/uploads/2023/08/Extentions.webp",
    "https://www.edunext.co/wp-content/uploads/2023/08/eox_core.png"
  ]
}
```

### Sample Provider Entry
```json
{
  "id": "edunext",
  "name": "eduNEXT",
  "url": "https://www.edunext.co",
  "logo": "https://www.edunext.co/wp-content/uploads/2022/10/Logos-eduNEXT-02-slim.png",
  "description": "Founded in Colombia in 2013, eduNEXT operates one of the world’s largest fleets of Open edX instances, serving organisations in more than 70 countries. Its cloud-native Cirrus/Stratus/Nimbus SaaS tiers, Tutor-based Control Centre and EOX plugin suite empower customers to launch branded learning sites within hours, while eduNEXT’s multilingual support, instructional-design studio and active code contributions strengthen the global ecosystem."
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
