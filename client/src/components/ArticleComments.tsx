import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface ArticleCommentsProps {
  articleId: number;
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  
  const { data: comments = [], isLoading, refetch } = trpc.articles.getComments.useQuery(
    { articleId }
  );
  
  const addCommentMutation = trpc.articles.addComment.useMutation({
    onSuccess: () => {
      setCommentText("");
      refetch();
    },
  });

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !user) return;
    
    await addCommentMutation.mutateAsync({
      articleId,
      content: commentText,
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-slate-900">ความเห็น</h3>

      {user && (
        <Card className="p-4 bg-gray-50">
          <div className="space-y-3">
            <Textarea
              placeholder="เพิ่มความเห็นของคุณ..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-24"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={addCommentMutation.isPending || !commentText.trim()}
                className="bg-green-500 hover:bg-green-600"
              >
                {addCommentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                ส่งความเห็น
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-green-500" />
          </div>
        )}

        {!isLoading && comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            ยังไม่มีความเห็นใดๆ เป็นคนแรกที่แสดงความเห็น
          </div>
        )}

        {Array.isArray(comments) && comments.map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-slate-900">ผู้ใช้ #{comment.userId}</p>
                <p className="text-sm text-gray-500">
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }) : "ไม่ทราบวันที่"}
                </p>
              </div>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
