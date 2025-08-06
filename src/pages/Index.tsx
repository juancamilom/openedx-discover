import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { ExtensionCard } from "@/components/ExtensionCard";
import { Pagination } from "@/components/Pagination";
import { ExtensionCardSkeleton, FilterSkeleton } from "@/components/LoadingSkeleton";
import { FilterOptions } from "@/types/extension";
import { useAllExtensionStats } from "@/hooks/useAllExtensionStats";
import { useExtensionRegistry, ExtensionWithProvider } from "@/hooks/useExtensionRegistry";
import { Button } from "@/components/ui/button";
import { Puzzle, ExternalLink, Server, BookOpen, Grid3x3 } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const ITEMS_PER_PAGE = 20;

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: registryData, isLoading: loading } = useExtensionRegistry();
  const { extensionStats, loading: statsLoading } = useAllExtensionStats();
  const extensions = registryData?.extensions || [];
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    category: "all",
    compatibility: "all",
    license: "all",
    rating: "all",
    provider: "all",
  });


  const filteredExtensions = useMemo(() => {
    return extensions.filter((extension) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          extension.name.toLowerCase().includes(searchLower) ||
          extension.description_short.toLowerCase().includes(searchLower) ||
          extension.provider.name.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category !== "all" && extension.category !== filters.category) {
        return false;
      }

      // Compatibility filter
      if (filters.compatibility !== "all" && !extension.core_compat.includes(filters.compatibility)) {
        return false;
      }

      // License filter
      if (filters.license !== "all" && extension.license !== filters.license) {
        return false;
      }

      // Rating filter
      if (filters.rating !== "all") {
        const minRating = parseFloat(filters.rating.replace("+", ""));
        // Check if extension has database rating, otherwise use static rating
        const dbStats = extensionStats[extension.slug];
        const currentRating = dbStats?.averageRating || extension.rating_avg || 0;
        if (currentRating < minRating) {
          return false;
        }
      }

      // Provider filter
      if (filters.provider !== "all" && extension.provider.name !== filters.provider) {
        return false;
      }

      return true;
    });
  }, [extensions, filters, extensionStats]);

  const totalPages = Math.ceil(filteredExtensions.length / ITEMS_PER_PAGE);
  const paginatedExtensions = filteredExtensions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      compatibility: "all",
      license: "all",
      rating: "all",
      provider: "all",
    });
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  const getCategoryDescription = (category: string) => {
    const descriptions = {
      "platform-native": "A self-hosted module that becomes a first-class part of your Open edX installation—no extra subscriptions or outside hosting needed. Once deployed, the feature works natively across every course and user. Classic examples include the **Credentials** micro-service, an **Indigo theme pack**, or a built-in **analytics pipeline** that processes learner data on your own servers.",
      "platform-connector": "A connector that wires your Open edX site to an **external** system running elsewhere. You still need an active account or license for that outside service; the module simply handles authentication and data flow. Think **Stripe Checkout** for payments, a **Salesforce CRM sync**, or a **WordPress CMS bridge**—all orchestrated at the platform level while the external tool remains separately procured.",
      "courseware-native": "Adds new interactive blocks that live entirely on your Open edX servers and appear in Studio like any built-in problem type. Learners stay inside the LMS, and authors gain fresh activity formats without external dependencies. Examples include the **Drag-and-Drop XBlock**, a self-hosted **H5P problem type**, or an in-platform **coding exercise** block.",
      "courseware-connector": "Embeds or launches a third-party learning tool inside course units—typically via **LTI 1.3** or a custom API. You license the external tool separately; the connector manages the handshake, grade pass-back, and roster sync. Popular cases are **Zoom LTI** for live sessions, **Labster virtual labs**, or **ProctorU** online proctoring, all dropped seamlessly into courseware."
    };
    return descriptions[category as keyof typeof descriptions] || "";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
              Open edX Extensions Directory
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Discover, search, and install powerful extensions for your Open edX platform. 
              From analytics dashboards to LTI integrations, find everything you need to enhance your educational experience.
            </p>
            
            {/* Category Selector */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-white/90">Choose your category</h2>
              <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                <Button
                  variant={filters.category === "platform-native" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("category", "platform-native")}
                  className="h-20 w-56 px-4 text-center"
                >
                  <div className="flex flex-col items-center">
                    <Server className="h-7 w-7 mb-2" />
                    <span className="text-base font-semibold leading-tight">Platform Module</span>
                    <span className="text-sm font-normal opacity-80">Native</span>
                  </div>
                </Button>
                <Button
                  variant={filters.category === "platform-connector" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("category", "platform-connector")}
                  className="h-20 w-56 px-4 text-center"
                >
                  <div className="flex flex-col items-center">
                    <Puzzle className="h-7 w-7 mb-2" />
                    <span className="text-base font-semibold leading-tight">Platform Module</span>
                    <span className="text-sm font-normal opacity-80">3rd-Party Integration</span>
                  </div>
                </Button>
                <Button
                  variant={filters.category === "courseware-native" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("category", "courseware-native")}
                  className="h-20 w-56 px-4 text-center"
                >
                  <div className="flex flex-col items-center">
                    <BookOpen className="h-7 w-7 mb-2" />
                    <span className="text-base font-semibold leading-tight">Courseware Component</span>
                    <span className="text-sm font-normal opacity-80">Native</span>
                  </div>
                </Button>
                <Button
                  variant={filters.category === "courseware-connector" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("category", "courseware-connector")}
                  className="h-20 w-56 px-4 text-center"
                >
                  <div className="flex flex-col items-center">
                    <ExternalLink className="h-7 w-7 mb-2" />
                    <span className="text-base font-semibold leading-tight">Courseware Component</span>
                    <span className="text-sm font-normal opacity-80">3rd-Party Integration</span>
                  </div>
                </Button>
                <Button
                  variant={filters.category === "all" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("category", "all")}
                  className="h-20 px-6"
                >
                  <div className="flex items-center">
                    <Grid3x3 className="h-6 w-6 mr-2" />
                    <span className="text-base font-semibold">All Extensions</span>
                  </div>
                </Button>
              </div>
            </div>
            
            {/* Category Description - Fixed space reserved */}
            <div className="mb-6 max-w-3xl mx-auto h-32 flex items-center">
              {filters.category !== "all" && (
                <div className="w-full">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                    <div className="text-base text-white leading-relaxed">
                      <ReactMarkdown 
                        components={{
                          p: ({ children }) => <p className="mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>
                        }}
                      >
                        {getCategoryDescription(filters.category)}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {loading ? (
                <FilterSkeleton />
              ) : (
                <FilterBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  resultCount={filteredExtensions.length}
                  extensions={extensions}
                />
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ExtensionCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredExtensions.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-4">No extensions found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or browse all available extensions.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {paginatedExtensions.map((extension) => (
                    <ExtensionCard key={extension.slug} extension={extension} />
                  ))}
                </div>
                
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
