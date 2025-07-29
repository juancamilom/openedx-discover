import { useState, useEffect, useMemo } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { ExtensionCard } from "@/components/ExtensionCard";
import { Pagination } from "@/components/Pagination";
import { ExtensionCardSkeleton, FilterSkeleton } from "@/components/LoadingSkeleton";
import { Extension, ExtensionRegistry, FilterOptions } from "@/types/extension";
import { Button } from "@/components/ui/button";
import { Puzzle, ExternalLink, Settings } from "lucide-react";

const ITEMS_PER_PAGE = 20;

const Index = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    type: "all",
    compatibility: "all",
    license: "all",
    price: "all",
  });

  useEffect(() => {
    async function fetchExtensions() {
      try {
        const response = await fetch('/registry.json');
        const data: ExtensionRegistry = await response.json();
        setExtensions(data.extensions);
      } catch (error) {
        console.error('Failed to load extensions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExtensions();
  }, []);

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

      // Price filter
      if (filters.price !== "all" && extension.price !== filters.price) {
        return false;
      }

      return true;
    });
  }, [extensions, filters]);

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
      type: "all",
      compatibility: "all",
      license: "all",
      price: "all",
    });
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Open edX Marketplace
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover, search, and install powerful extensions for your Open edX platform. 
              From analytics dashboards to LTI integrations, find everything you need to enhance your educational experience.
            </p>
            
            {/* Category Selector */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Choose your category</h2>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Button
                  variant={filters.type === "operational-service" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("type", "operational-service")}
                  className="h-12 px-6"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Operational Services
                </Button>
                <Button
                  variant={filters.type === "platform-addon" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("type", "platform-addon")}
                  className="h-12 px-6"
                >
                  <Puzzle className="h-5 w-5 mr-2" />
                  Platform Add-ons
                </Button>
                <Button
                  variant={filters.type === "external-tool" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("type", "external-tool")}
                  className="h-12 px-6"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  External Tools (LTI)
                </Button>
                <Button
                  variant={filters.type === "all" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("type", "all")}
                  className="h-12 px-6"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  All Extensions
                </Button>
              </div>
            </div>
            
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
