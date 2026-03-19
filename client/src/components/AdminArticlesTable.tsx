import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, Edit2, Eye, EyeOff } from "lucide-react";

export function AdminArticlesTable() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data: articles, isLoading, refetch } = trpc.admin.articles.list.useQuery({
    limit,
    offset: page * limit,
  });

  const updateMutation = trpc.admin.articles.update.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteMutation = trpc.admin.articles.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleTogglePublish = (id: number, published: boolean) => {
    updateMutation.mutate({
      id,
      published: !published,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("ยืนยันการลบบทความนี้?")) {
      deleteMutation.mutate({ id });
    }
  };

  if (isLoading) return <div>กำลังโหลด...</div>;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">จัดการบทความ</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ชื่อเรื่อง</th>
              <th className="px-4 py-2 text-left">หมวดหมู่</th>
              <th className="px-4 py-2 text-left">สถานะ</th>
              <th className="px-4 py-2 text-left">ผู้เขียน</th>
              <th className="px-4 py-2 text-left">มุมมอง</th>
              <th className="px-4 py-2 text-left">วันที่สร้าง</th>
              <th className="px-4 py-2 text-center">การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {articles?.map((article) => (
              <tr key={article.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{article.title}</td>
                <td className="px-4 py-2">{article.category}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      article.published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {article.published ? "เผยแพร่" : "ร่าง"}
                  </span>
                </td>
                <td className="px-4 py-2">{article.authorId}</td>
                <td className="px-4 py-2">{article.viewCount}</td>
                <td className="px-4 py-2">{new Date(article.createdAt).toLocaleDateString("th-TH")}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleTogglePublish(article.id, Boolean(article.published))}
                    >
                      {article.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
          ก่อนหน้า
        </Button>
        <span>หน้า {page + 1}</span>
        <Button onClick={() => setPage(page + 1)} disabled={!articles || articles.length < limit}>
          ถัดไป
        </Button>
      </div>
    </Card>
  );
}
