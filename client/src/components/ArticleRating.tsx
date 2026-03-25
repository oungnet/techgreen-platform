import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface ArticleRatingProps {
  articleId: number;
}

export function ArticleRating({ articleId }: ArticleRatingProps) {
  const { user } = useAuth();
  const [hoverRating, setHoverRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  
  const { data: rating } = trpc.articles.getRating.useQuery({ articleId });
  const rateMutation = trpc.articles.rate.useMutation({
    onSuccess: (data) => {
      setUserRating(data.score);
    },
  });

  const handleRate = async (score: number) => {
    if (!user) return;
    await rateMutation.mutateAsync({ articleId, score });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoverRating || userRating);
          return (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              disabled={!user || rateMutation.isPending}
              className="transition-transform hover:scale-110 disabled:opacity-50"
            >
              <Star
                size={24}
                className={isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            </button>
          );
        })}
      </div>
      
      <div className="text-sm text-gray-600">
        {rating ? (
          <>
            <span className="font-semibold text-slate-900">
              {Number(rating.average || 0).toFixed(1)}
            </span>
            <span className="text-gray-500"> ({rating.count || 0} คะแนน)</span>
          </>
        ) : (
          <span className="text-gray-400">ยังไม่มีคะแนน</span>
        )}
      </div>

      {rateMutation.isPending && (
        <Loader2 className="h-4 w-4 animate-spin text-green-500" />
      )}
    </div>
  );
}
