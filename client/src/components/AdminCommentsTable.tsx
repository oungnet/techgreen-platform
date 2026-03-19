import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Trash2 } from "lucide-react";

export function AdminCommentsTable() {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<boolean | undefined>(undefined);
  const limit = 10;

  const { data: comments, isLoading, refetch } = trpc.admin.comments.list.useQuery({
    approved: filter,
    limit,
    offset: page * limit,
  });

  const approveMutation = trpc.admin.comments.approve.useMutation({
    onSuccess: () => refetch(),
  });

  const rejectMutation = trpc.admin.comments.reject.useMutation({
    onSuccess: () => refetch(),
  });

  const deleteMutation = trpc.admin.comments.delete.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) return <div>กำลังโหลด...</div>;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">จัดการความคิดเห็น</h2>

      <div className="mb-4 flex gap-2">
        <Button
          variant={filter === undefined ? "default" : "outline"}
          onClick={() => {
            setFilter(undefined);
            setPage(0);
          }}
        >
          ทั้งหมด
        </Button>
        <Button
          variant={filter === false ? "default" : "outline"}
          onClick={() => {
            setFilter(false);
            setPage(0);
          }}
        >
          รอการอนุมัติ
        </Button>
        <Button
          variant={filter === true ? "default" : "outline"}
          onClick={() => {
            setFilter(true);
            setPage(0);
          }}
        >
          อนุมัติแล้ว
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ผู้แสดงความคิดเห็น</th>
              <th className="px-4 py-2 text-left">ความคิดเห็น</th>
              <th className="px-4 py-2 text-left">สถานะ</th>
              <th className="px-4 py-2 text-left">วันที่</th>
              <th className="px-4 py-2 text-center">การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {comments?.map((comment) => (
              <tr key={comment.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{comment.userId}</td>
                <td className="px-4 py-2 max-w-xs truncate">{comment.content}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      comment.approved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {comment.approved ? "อนุมัติ" : "รอการอนุมัติ"}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(comment.createdAt).toLocaleDateString("th-TH")}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    {!comment.approved && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => approveMutation.mutate({ id: comment.id })}
                        className="text-green-600"
                      >
                        <Check size={16} />
                      </Button>
                    )}
                    {comment.approved && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => rejectMutation.mutate({ id: comment.id })}
                        className="text-yellow-600"
                      >
                        <X size={16} />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm("ยืนยันการลบความคิดเห็นนี้?")) {
                          deleteMutation.mutate({ id: comment.id });
                        }
                      }}
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
        <Button onClick={() => setPage(page + 1)} disabled={!comments || comments.length < limit}>
          ถัดไป
        </Button>
      </div>
    </Card>
  );
}
