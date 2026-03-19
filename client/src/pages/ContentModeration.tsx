import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function ContentModeration() {
  const { data: queue, isLoading, refetch } = trpc.moderation.getQueue.useQuery();
  const approveMutation = trpc.moderation.approve.useMutation();
  const rejectMutation = trpc.moderation.reject.useMutation();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleApprove = async (moderationId: number) => {
    try {
      await approveMutation.mutateAsync({ moderationId });
      refetch();
      setSelectedId(null);
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (moderationId: number) => {
    try {
      await rejectMutation.mutateAsync({ moderationId });
      refetch();
      setSelectedId(null);
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Content Moderation</h1>

      <div className="mb-6">
        <Card className="p-4 bg-blue-50">
          <p className="text-lg font-semibold">
            Pending Review: <span className="text-blue-600">{queue?.length || 0}</span>
          </p>
        </Card>
      </div>

      {queue && queue.length === 0 ? (
        <Card className="p-8 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">No comments pending review</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {queue?.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  Flagged by user #{item.flaggedBy} • {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="font-semibold text-lg mb-2">Reason: {item.reason}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-4">
                <p className="text-gray-700">Comment ID: {item.commentId}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleApprove(item.id)}
                  disabled={approveMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(item.id)}
                  disabled={rejectMutation.isPending}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
