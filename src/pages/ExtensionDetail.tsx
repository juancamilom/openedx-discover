import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Extension, ExtensionRegistry } from "@/types/extension";
import { ArrowLeft, Star, ExternalLink, Download, Github, Shield, DollarSign } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
  const [extension, setExtension] = useState<Extension | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchExtension() {
      try {
        const response = await fetch('/registry.json');
        const data: ExtensionRegistry = await response.json();
        const found = data.extensions.find(ext => ext.slug === slug);
        setExtension(found || null);
      } catch (error) {
        console.error('Failed to load extension:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExtension();
  }, [slug]);

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
                  <span className="font-medium">{extension.rating_avg}</span>
                  <span className="text-muted-foreground">({extension.rating_count} reviews)</span>
                </div>
                
                <div className="text-muted-foreground">
                  Version {extension.latest_version}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button size="lg" className="gap-2">
                <Download className="h-5 w-5" />
                Install Extension
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
            <div className="relative">
              <img
                src={extension.screenshots[currentImageIndex]}
                alt={`${extension.name} screenshot ${currentImageIndex + 1}`}
                className="w-full h-96 object-cover rounded-lg"
              />
              {extension.screenshots.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {extension.screenshots.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
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
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{extension.provider.name}</h3>
                    <p className="text-sm text-muted-foreground">Extension Provider</p>
                  </div>
                </div>
                
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
    </div>
  );
}