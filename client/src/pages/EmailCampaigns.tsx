import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Send } from 'lucide-react';
import { useState } from 'react';

export default function EmailCampaigns() {
  const { data: campaigns, isLoading, refetch } = trpc.campaigns.list.useQuery();
  const createMutation = trpc.campaigns.create.useMutation();
  const sendMutation = trpc.campaigns.updateStatus.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      setFormData({ title: '', subject: '', content: '' });
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleSend = async (campaignId: number) => {
    try {
      await sendMutation.mutateAsync({ campaignId, status: 'sent' });
      refetch();
    } catch (error) {
      console.error('Failed to send campaign:', error);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Email Campaigns</h1>
        <Button onClick={() => setShowForm(!showForm)} className="bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Create Campaign</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Campaign title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Email subject"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Email content"
                className="w-full p-2 border rounded"
                rows={6}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={createMutation.isPending}>
                Create Campaign
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {campaigns && campaigns.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No campaigns yet. Create one to get started!</p>
          </Card>
        ) : (
          campaigns?.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{campaign.title}</h3>
                  <p className="text-gray-600">{campaign.subject}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {campaign.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Recipients</p>
                  <p className="text-2xl font-bold">{campaign.recipientCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Opens</p>
                  <p className="text-2xl font-bold">{campaign.openCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Clicks</p>
                  <p className="text-2xl font-bold">{campaign.clickCount}</p>
                </div>
              </div>

              {campaign.status === 'draft' && (
                <Button
                  onClick={() => handleSend(campaign.id)}
                  disabled={sendMutation.isPending}
                  className="bg-blue-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Campaign
                </Button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
