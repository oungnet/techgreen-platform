import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  published: number;
  createdAt: Date;
  updatedAt: Date;
  excerpt?: string | null;
  coverImage?: string | null;
  authorId: number;
  viewCount: number;
}

export default function ContentManagement() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    category: 'general',
  });

  const articlesQuery = trpc.articles.list.useQuery({ limit: 50, offset: 0 });
  const createArticleMutation = trpc.articles.create.useMutation();

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-red-600">Access Denied: Admin only</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        toast.success('Article update feature coming soon');
      } else {
        await createArticleMutation.mutateAsync({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          category: formData.category,
        });
        toast.success('Article created successfully');
      }
      setFormData({ title: '', slug: '', content: '', category: 'general' });
      setEditingId(null);
      setIsOpen(false);
      articlesQuery.refetch();
    } catch (error) {
      toast.error('Failed to save article');
    }
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      slug: article.slug,
      content: article.content,
      category: article.category,
    });
    setEditingId(article.id);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this article?')) {
      toast.info('Delete feature coming soon');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Content Management</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingId(null); setFormData({ title: '', slug: '', content: '', category: 'general' }); }}>
                <Plus className="mr-2" size={20} />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Article' : 'Create New Article'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Article title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="article-slug"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="disability">Disability Benefits</SelectItem>
                      <SelectItem value="tax">Tax Benefits</SelectItem>
                      <SelectItem value="resources">Resources</SelectItem>
                      <SelectItem value="innovation">Innovation</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Article content"
                    rows={6}
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {articlesQuery.isLoading ? (
          <div>Loading articles...</div>
        ) : articlesQuery.data?.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            <p>No articles yet. Create your first article!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {articlesQuery.data?.map((article: Article) => (
              <Card key={article.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{article.title}</h3>
                    <p className="text-sm text-gray-600">{article.slug}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {article.category} | Updated: {new Date(article.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(article)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
