import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useExtensionRegistry, ExtensionWithProvider } from "@/hooks/useExtensionRegistry";
import { ArrowLeft, Star, ExternalLink, Download, Github, Shield, DollarSign, Play, Pause, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { RatingModal } from "@/components/RatingModal";
import { ReviewsList } from "@/components/ReviewsList";
import { useExtensionStats } from "@/hooks/useExtensionStats";

const typeColors = {
  "platform-addon": "bg-primary/10 text-primary border-primary/20",
  "external-tool": "bg-accent/10 text-accent border-accent/20", 
  "operational-service": "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const typeLabels = {
  "platform-addon": "Platform Add-on",
  "external-tool": "External Tool",
  "operational-service": "Operational Service",
};

export default function ExtensionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: registryData, isLoading: loading } = useExtensionRegistry();
  const extension = registryData?.extensions.find(ext => ext.slug === slug) || null;
  const [api, setApi] = useState<CarouselApi>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  
  const { stats, refetch: refetchStats } = useExtensionStats(slug || "");


  // Autoplay functionality
  useEffect(() => {
    if (!api || !extension?.screenshots || extension.screenshots.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      if (isPlaying) {
        api.scrollNext();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [api, isPlaying, extension?.screenshots]);

  const toggleAutoplay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="h-12 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-48 bg-muted rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-24 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!extension) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Extension Not Found</h1>
          <p className="text-muted-foreground mb-6">The extension you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={typeColors[extension.type]}>
                  {typeLabels[extension.type]}
                </Badge>
                <Badge variant={extension.price === "free" ? "secondary" : "default"}>
                  {extension.price === "free" ? "Free" : "Paid"}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-2">{extension.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{extension.description_short}</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src={extension.provider.logo}
                    alt={extension.provider.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium">{extension.provider.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {stats.reviewCount > 0 ? stats.averageRating : extension.rating_avg}
                  </span>
                  <span className="text-muted-foreground">
                    ({stats.reviewCount > 0 ? stats.reviewCount : extension.rating_count} reviews)
                  </span>
                </div>
                
                <div className="text-muted-foreground">
                  Version {extension.latest_version}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button size="lg" className="gap-2" disabled>
                        <Download className="h-5 w-5" />
                        Install Extension
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This feature may be available in the future</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setIsRatingModalOpen(true)}
                className="gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                Rate it
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={extension.repo_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <Github className="h-5 w-5" />
                  View Source
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Screenshots Carousel */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="relative group">
              <Carousel
                setApi={setApi}
                className="w-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {extension.screenshots.map((screenshot, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={screenshot}
                        alt={`${extension.name} screenshot ${index + 1}`}
                        className="w-full h-96 object-contain rounded-lg bg-muted/10"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                {extension.screenshots.length > 1 && (
                  <>
                    <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Autoplay controls */}
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-4 right-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={toggleAutoplay}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
              </Carousel>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{extension.description_long}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Installation */}
            <Card>
              <CardHeader>
                <CardTitle>Installation & Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{extension.install_notes}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewsList extensionSlug={extension.slug} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Extension Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Latest Version</span>
                  <span className="font-medium">{extension.latest_version}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">License</span>
                  <Badge variant="outline">{extension.license}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium capitalize">{extension.price}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <span className="text-sm text-muted-foreground block mb-2">Compatibility</span>
                  <div className="flex flex-wrap gap-1">
                    {extension.core_compat.map((version) => (
                      <Badge key={version} variant="outline" className="text-xs">
                        {version.charAt(0).toUpperCase() + version.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Info */}
            <Card>
              <CardHeader>
                <CardTitle>Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={extension.provider.logo}
                    alt={extension.provider.name}
                    className="w-36 h-36 rounded-lg object-contain bg-muted/20 p-2"
                  />
                  <div>
                    <h3 className="font-semibold">{extension.provider.name}</h3>
                    <p className="text-sm text-muted-foreground">Extension Provider</p>
                  </div>
                </div>
                
                {extension.provider.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {extension.provider.description}
                  </p>
                )}
                
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href={extension.provider.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Visit Provider
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {extension && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => {
            setIsRatingModalOpen(false);
            refetchStats();
          }}
          extensionSlug={extension.slug}
        />
      )}
    </div>
  );
}