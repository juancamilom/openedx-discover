import { useState, useEffect, useMemo, useCallback } from "react";
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
  
  // Debug: Track all currentPage changes
  useEffect(() => {
    console.log('currentPage changed to:', currentPage, 'Stack:', new Error().stack);
  }, [currentPage]);
  const { data: registryData, isLoading: loading } = useExtensionRegistry();
  const { extensionStats, loading: statsLoading } = useAllExtensionStats();
  const extensions = registryData?.extensions || [];
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    category: "all",
    type: "all",
    compatibility: "all",
    license: "all",
    rating: "all",
    provider: "all",
  });

  // Main filtered extensions - stable, no dependency on extensionStats
  const baseFilteredExtensions = useMemo(() => {
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

      // Type filter
      if (filters.type !== "all" && extension.type !== filters.type) {
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

      // Provider filter
      if (filters.provider !== "all" && extension.provider.name.toLowerCase() !== filters.provider.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [extensions, filters.search, filters.category, filters.type, filters.compatibility, filters.license, filters.provider]);

  // Apply rating filter separately only when needed
  const stableFilteredExtensions = useMemo(() => {
    if (filters.rating === "all") {
      return baseFilteredExtensions;
    }
    
    const minRating = parseFloat(filters.rating.replace("+", ""));
    return baseFilteredExtensions.filter((extension) => {
      const dbStats = extensionStats?.[extension.slug];
      const currentRating = dbStats?.averageRating || 0;
      return currentRating >= minRating;
    });
  }, [baseFilteredExtensions, filters.rating, extensionStats]);

  const totalPages = Math.ceil(stableFilteredExtensions.length / ITEMS_PER_PAGE);
  
  // Debug: Track totalPages changes
  useEffect(() => {
    console.log('totalPages changed to:', totalPages, 'stableFilteredExtensions.length:', stableFilteredExtensions.length);
  }, [totalPages, stableFilteredExtensions.length]);
  
  // Ensure currentPage doesn't exceed totalPages when data changes
  useEffect(() => {
    console.log('Checking if currentPage > totalPages:', currentPage, '>', totalPages);
    if (currentPage > totalPages && totalPages > 0) {
      console.log('RESETTING currentPage from', currentPage, 'to', totalPages);
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);
  
  const paginatedExtensions = stableFilteredExtensions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    console.log('handleFilterChange called with:', key, value, 'Stack:', new Error().stack);
    setCurrentPage(1); // Reset to page 1 when filter changes
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Reset type filter when category changes
      if (key === "category") {
        newFilters.type = "all";
      }
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    console.log('handleClearFilters called, Stack:', new Error().stack);
    setCurrentPage(1); // Reset to page 1 when clearing filters
    setFilters({
      search: "",
      category: "all",
      type: "all",
      compatibility: "all",
      license: "all",
      rating: "all",
      provider: "all",
    });
  };

  const handleSearch = useCallback((query: string) => {
    console.log('handleSearch called with:', query, 'Stack:', new Error().stack);
    setCurrentPage(1); // Reset to page 1 when searching
    setFilters(prev => ({ ...prev, search: query }));
  }, []);

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
      <div className="relative h-[360px] md:h-[420px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              Open edX Extensions Directory
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-4 max-w-3xl mx-auto drop-shadow-md">
              Discover, search, and install powerful extensions for your Open edX platform. 
              From analytics dashboards to LTI integrations, find everything you need to enhance your educational experience.
            </p>
            
            {/* Category Selector */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-4 text-white/90">Choose your category</h2>
              <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                <Button
                  variant={filters.category === "platform-native" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("category", "platform-native")}
                  className="h-16 w-52 px-4 text-center"
                >
                  <div className="flex items-center gap-3">
                    <Server className="h-6 w-6" />
                    <div className="text-left leading-tight">
                      <span className="text-base font-semibold block">Platform Module</span>
                      <span className="text-sm font-normal opacity-80 block">Native</span>
                    </div>
                  </div>
                </Button>
                <Button
                  variant={filters.category === "platform-connector" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("category", "platform-connector")}
                  className="h-16 w-52 px-4 text-center"
                >
                  <div className="flex items-center gap-3">
                    <Puzzle className="h-6 w-6" />
                    <div className="text-left leading-tight">
                      <span className="text-base font-semibold block">Platform Module</span>
                      <span className="text-sm font-normal opacity-80 block">3rd-Party Integration</span>
                    </div>
                  </div>
                </Button>
                <Button
                  variant={filters.category === "courseware-native" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("category", "courseware-native")}
                  className="h-16 w-52 px-4 text-center"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6" />
                    <div className="text-left leading-tight">
                      <span className="text-base font-semibold block">Courseware Component</span>
                      <span className="text-sm font-normal opacity-80 block">Native</span>
                    </div>
                  </div>
                </Button>
                <Button
                  variant={filters.category === "courseware-connector" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("category", "courseware-connector")}
                  className="h-16 w-52 px-4 text-center"
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-6 w-6" />
                    <div className="text-left leading-tight">
                      <span className="text-base font-semibold block">Courseware Component</span>
                      <span className="text-sm font-normal opacity-80 block">3rd-Party Integration</span>
                    </div>
                  </div>
                </Button>
                <Button
                  variant={filters.category === "all" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("category", "all")}
                  className="h-16 px-6"
                >
                  <div className="flex items-center">
                    <Grid3x3 className="h-6 w-6 mr-2" />
                    <span className="text-base font-semibold">All Extensions</span>
                  </div>
                </Button>
              </div>
            </div>
            
            {/* Category Description - Fixed space reserved */}
            <div className="mb-2 max-w-5xl mx-auto h-20 flex items-center">
              {filters.category !== "all" && (
                <div className="w-full">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <div className="text-sm md:text-base text-white leading-relaxed">
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
                  resultCount={stableFilteredExtensions.length}
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
            ) : stableFilteredExtensions.length === 0 ? (
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
                  {paginatedExtensions.map((extension, index) => (
                    <ExtensionCard 
                      key={`${extension.slug}-${index}`} 
                      extension={extension} 
                      stats={extensionStats?.[extension.slug]}
                    />
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
