import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Review {
  id: string;
  openedx_url: string;
  rating: number;
  comment: string | null;
  created_at: string;
  name?: string | null;
}

interface ReviewsListProps {
  extensionSlug: string;
}

export function ReviewsList({ extensionSlug }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [extensionSlug]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("extension_slug", extensionSlug)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  if (loading) {
    return <div className="text-muted-foreground">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to rate this extension!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Reviews</h3>
      
      <div className="space-y-3">
        {displayedReviews.map((review) => (
          <Card key={review.id} className="bg-muted/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate max-w-[50%]">{review.name || "Anonymous"}</span>
                  <span aria-hidden>•</span>
                  <span>{format(new Date(review.created_at), "MMM d, yyyy")}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {review.comment && (
                <p className="text-sm text-foreground mb-2">{review.comment}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Used on: {new URL(review.openedx_url).hostname}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length > 3 && !showAll && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(true)}
          className="w-full"
        >
          Show {reviews.length - 3} more reviews
        </Button>
      )}

      {showAll && reviews.length > 3 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(false)}
          className="w-full"
        >
          Show less
        </Button>
      )}
    </div>
  );
}