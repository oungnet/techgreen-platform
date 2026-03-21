import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface ArticleFormData {
  id?: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  published: boolean;
}

const INITIAL_FORM: ArticleFormData = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  category: "general",
  published: false,
};

const CATEGORIES = ["general", "technology", "business", "health", "education", "lifestyle"];

export default function ArticleManagement() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>(INITIAL_FORM);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const itemsPerPage = 10;

  // Fetch articles
  const { data: articlesData, isLoading, refetch } = trpc.admin.articles.list.useQuery({
    limit: 100,
    offset: 0,
  });

  // Mutations
  const createMutation = trpc.articles.create.useMutation({
    onSuccess: () => {
      setFormData(INITIAL_FORM);
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      alert("เกิดข้อผิดพลาด: " + error.message);
    },
  });

  const updateMutation = trpc.admin.articles.update.useMutation({
    onSuccess: () => {
      setFormData(INITIAL_FORM);
      setEditingId(null);
      setShowForm(false);
      refetch();
    },
    onError: (error) => {
      alert("เกิดข้อผิดพลาด: " + error.message);
    },
  });

  const deleteMutation = trpc.admin.articles.delete.useMutation({
    onSuccess: () => {
      setDeleteConfirm(null);
      refetch();
    },
    onError: (error) => {
      alert("เกิดข้อผิดพลาด: " + error.message);
    },
  });

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    if (!articlesData) return [];

    let filtered = articlesData.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || article.category === filterCategory;

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "published" && article.published) ||
        (filterStatus === "draft" && !article.published);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title, "th");
        case "title-desc":
          return b.title.localeCompare(a.title, "th");
        case "views-desc":
          return (b.viewCount || 0) - (a.viewCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [articlesData, searchTerm, filterCategory, filterStatus, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIdx, startIdx + itemsPerPage);

  const handleEditClick = (article: any) => {
    setFormData({
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content || "",
      excerpt: article.excerpt || "",
      category: article.category || "general",
      published: !!article.published,
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setFormData(INITIAL_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      alert("กรุณากรอกข้อมูลที่จำเป็น (ชื่อ, slug, เนื้อหา)");
      return;
    }

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        published: formData.published,
      });
    } else {
      await createMutation.mutateAsync({
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
      });
    }
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync({ id });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">กรุณาล็อกอินเพื่อจัดการบทความ</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">จัดการบทความ</h1>
        <p className="text-gray-600">เพิ่ม แก้ไข ลบ และจัดการบทความทั้งหมดได้ที่เดียว</p>
      </div>

      {/* Add Article Button */}
      <div className="mb-6">
        <Button
          onClick={handleAddClick}
          className="bg-green-500 hover:bg-green-600"
          disabled={showForm}
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มบทความใหม่
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {editingId ? "แก้ไขบทความ" : "เพิ่มบทความใหม่"}
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  ชื่อบทความ *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ชื่อบทความ"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Slug (URL) *
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="article-slug"
                  disabled={!!editingId}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                บทคัดย่อ
              </label>
              <Input
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="บทคัดย่อสั้นๆ"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                เนื้อหา *
              </label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="เนื้อหาบทความ"
                className="min-h-40"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  หมวดหมู่
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-slate-900">เผยแพร่ทันที</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {editingId ? "อัพเดท" : "สร้าง"}
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setFormData(INITIAL_FORM);
                  setEditingId(null);
                }}
                variant="outline"
                className="flex-1"
              >
                ยกเลิก
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="p-6 mb-6 bg-white">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="ค้นหาบทความ..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                หมวดหมู่
              </label>
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">ทั้งหมด</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">สถานะ</label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">ทั้งหมด</option>
                <option value="published">เผยแพร่</option>
                <option value="draft">ร่าง</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">เรียงลำดับ</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">วันที่ใหม่สุด</option>
                <option value="date-asc">วันที่เก่าสุด</option>
                <option value="title-asc">ชื่อ (A-Z)</option>
                <option value="title-desc">ชื่อ (Z-A)</option>
                <option value="views-desc">ยอดวิว</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                  setFilterStatus("all");
                  setSortBy("date-desc");
                  setCurrentPage(1);
                }}
                variant="outline"
                className="w-full"
              >
                รีเซ็ต
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Articles Table */}
      <Card className="p-6 bg-white">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin w-6 h-6 text-green-500" />
          </div>
        ) : paginatedArticles.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">ชื่อบทความ</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">หมวดหมู่</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">สถานะ</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">ยอดวิว</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">วันที่</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArticles.map((article) => (
                    <tr key={article.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{article.title}</td>
                      <td className="py-3 px-4 text-gray-700">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {article.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            article.published
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {article.published ? "เผยแพร่" : "ร่าง"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{article.viewCount || 0}</td>
                      <td className="py-3 px-4 text-gray-700 text-sm">
                        {format(new Date(article.createdAt), "d MMM yyyy", { locale: th })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(article)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                            title="แก้ไข"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(article.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                แสดง {startIdx + 1} ถึง {Math.min(startIdx + itemsPerPage, filteredArticles.length)} จาก{" "}
                {filteredArticles.length} บทความ
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="flex items-center px-3 text-sm font-semibold">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <p>ไม่พบบทความ</p>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-sm">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-bold text-slate-900 text-center mb-4">ยืนยันการลบ</h3>
            <p className="text-gray-600 text-center mb-6">
              คุณแน่ใจหรือว่าต้องการลบบทความนี้? การกระทำนี้ไม่สามารถยกเลิกได้
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                ลบ
              </Button>
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                className="flex-1"
              >
                ยกเลิก
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
