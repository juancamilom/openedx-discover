import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ExtensionStatsMap {
  [extensionSlug: string]: {
    averageRating: number;
    reviewCount: number;
  };
}

export function useAllExtensionStats() {
  const [extensionStats, setExtensionStats] = useState<ExtensionStatsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("extension_slug, rating");

      if (error) throw error;

      // Group reviews by extension and calculate averages
      const statsMap: ExtensionStatsMap = {};
      
      if (data && data.length > 0) {
        const groupedData = data.reduce((acc, review) => {
          if (!acc[review.extension_slug]) {
            acc[review.extension_slug] = [];
          }
          acc[review.extension_slug].push(review.rating);
          return acc;
        }, {} as { [key: string]: number[] });

        Object.keys(groupedData).forEach(slug => {
          const ratings = groupedData[slug];
          const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
          const averageRating = totalRating / ratings.length;
          
          statsMap[slug] = {
            averageRating: Math.round(averageRating * 10) / 10,
            reviewCount: ratings.length,
          };
        });
      }

      setExtensionStats(statsMap);
    } catch (error) {
      console.error("Error fetching all extension stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return { extensionStats, loading, refetch: fetchAllStats };
}