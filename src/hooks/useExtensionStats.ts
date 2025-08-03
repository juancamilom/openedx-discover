import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ExtensionStats {
  averageRating: number;
  reviewCount: number;
}

export function useExtensionStats(extensionSlug: string) {
  const [stats, setStats] = useState<ExtensionStats>({
    averageRating: 0,
    reviewCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [extensionSlug]);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("extension_slug", extensionSlug);

      if (error) throw error;

      if (data && data.length > 0) {
        const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / data.length;
        
        setStats({
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          reviewCount: data.length,
        });
      } else {
        setStats({
          averageRating: 0,
          reviewCount: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching extension stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchStats };
}