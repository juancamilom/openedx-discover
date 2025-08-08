import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtensionWithProvider } from "@/hooks/useExtensionRegistry";
import { Star, ExternalLink, Download } from "lucide-react";
import { Link } from "react-router-dom";
import platformNativeFallback from "@/assets/fallback-platform-native.jpg";
import platformConnectorFallback from "@/assets/fallback-platform-connector.jpg";
import coursewareNativeFallback from "@/assets/fallback-courseware-native.jpg";
import coursewareConnectorFallback from "@/assets/fallback-courseware-connector.jpg";

interface ExtensionCardProps {
  extension: ExtensionWithProvider;
  stats?: {
    averageRating: number;
    reviewCount: number;
  };
}


const categoryLabels = {
  "platform-native": "Platform Module – Native",
  "platform-connector": "Platform Module – 3rd-Party Integration",
  "courseware-native": "Courseware Component – Native",
  "courseware-connector": "Courseware Component – 3rd-Party Integration",
};

export function ExtensionCard({ extension, stats }: ExtensionCardProps) {
  const fallbackByCategory: Record<ExtensionWithProvider["category"], string> = {
    "platform-native": platformNativeFallback,
    "platform-connector": platformConnectorFallback,
    "courseware-native": coursewareNativeFallback,
    "courseware-connector": coursewareConnectorFallback,
  };

  const primaryImage = extension.screenshots?.[0] || fallbackByCategory[extension.category];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="relative overflow-hidden rounded-t-lg">
        <Link to={`/extension/${extension.slug}`} className="block">
          <img
            src={primaryImage}
            alt={`${extension.name} – ${categoryLabels[extension.category]} default image`}
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackByCategory[extension.category]; }}
            className="w-full h-48 object-contain bg-muted/20 transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          />
        </Link>
        <div className="absolute top-4 right-4">
          <Badge variant={extension.price === "free" ? "secondary" : "default"}>
            {extension.price === "free" ? "Free" : "Paid"}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">{extension.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {categoryLabels[extension.category]} • {extension.type}
            </CardDescription>
          </div>
          <img
            src={extension.provider.logo}
            alt={extension.provider.name}
            className="w-24 h-24 rounded-lg flex-shrink-0 object-contain bg-white/5 p-2"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {extension.description_short}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">
               {stats?.reviewCount > 0 ? stats.averageRating : 'No reviews'}
             </span>
             <span className="text-muted-foreground">
               ({stats?.reviewCount || 0})
            </span>
          </div>
          <div className="flex gap-1">
            {extension.core_compat.slice(0, 2).map((version) => (
              <Badge key={version} variant="outline" className="text-xs">
                {version.charAt(0).toUpperCase() + version.slice(1)}
              </Badge>
            ))}
            {extension.core_compat.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{extension.core_compat.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button asChild size="sm" className="flex-1">
            <Link to={`/extension/${extension.slug}`}>
              <Download className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
          {extension.repo_url ? (
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={extension.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              aria-disabled
              title="Repository link unavailable"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}