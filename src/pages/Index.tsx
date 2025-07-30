import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
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
    provider: "all",
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

      // Provider filter
      if (filters.provider !== "all" && extension.provider.name !== filters.provider) {
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
      provider: "all",
    });
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    setCurrentPage(1);
  };

  const getCategoryDescription = (type: string) => {
    const descriptions = {
      "platform-native": "A self-hosted module that becomes a first-class part of your Open edX installation—no extra subscriptions or outside hosting needed. Once deployed, the feature works natively across every course and user. Classic examples include the **Credentials** micro-service, an **Indigo theme pack**, or a built-in **analytics pipeline** that processes learner data on your own servers.",
      "platform-connector": "A connector that wires your Open edX site to an **external** system running elsewhere. You still need an active account or license for that outside service; the module simply handles authentication and data flow. Think **Stripe Checkout** for payments, a **Salesforce CRM sync**, or a **WordPress CMS bridge**—all orchestrated at the platform level while the external tool remains separately procured.",
      "courseware-native": "Adds new interactive blocks that live entirely on your Open edX servers and appear in Studio like any built-in problem type. Learners stay inside the LMS, and authors gain fresh activity formats without external dependencies. Examples include the **Drag-and-Drop XBlock**, a self-hosted **H5P problem type**, or an in-platform **coding exercise** block.",
      "courseware-connector": "Embeds or launches a third-party learning tool inside course units—typically via **LTI 1.3** or a custom API. You license the external tool separately; the connector manages the handshake, grade pass-back, and roster sync. Popular cases are **Zoom LTI** for live sessions, **Labster virtual labs**, or **ProctorU** online proctoring, all dropped seamlessly into courseware."
    };
    return descriptions[type as keyof typeof descriptions] || "";
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
                  variant={filters.type === "platform-native" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("type", "platform-native")}
                  className="h-12 px-6"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Platform Module – Native
                </Button>
                <Button
                  variant={filters.type === "platform-connector" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("type", "platform-connector")}
                  className="h-12 px-6"
                >
                  <Puzzle className="h-5 w-5 mr-2" />
                  Platform Module – 3rd-Party Integration
                </Button>
                <Button
                  variant={filters.type === "courseware-native" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("type", "courseware-native")}
                  className="h-12 px-6"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Courseware Component – Native
                </Button>
                <Button
                  variant={filters.type === "courseware-connector" ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleFilterChange("type", "courseware-connector")}
                  className="h-12 px-6"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Courseware Component – 3rd-Party Integration
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
              
              {/* Category Description */}
              {filters.type !== "all" && (
                <div className="mb-6 max-w-3xl mx-auto">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <div className="text-base text-primary leading-relaxed">
                      <ReactMarkdown 
                        components={{
                          p: ({ children }) => <p className="mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>
                        }}
                      >
                        {getCategoryDescription(filters.type)}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
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
