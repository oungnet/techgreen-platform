import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import AdminRouteGuard from "@/components/AdminRouteGuard";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminContentStudio() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Tech");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const slug = useMemo(() => slugify(title), [title]);
  const createArticle = trpc.articles.create.useMutation();

  const submit = async () => {
    setMessage("");
    setError("");
    try {
      await createArticle.mutateAsync({
        title,
        slug,
        excerpt,
        category,
        content,
        coverImage: coverImage || undefined,
      });
      setMessage("บันทึกบทความสำเร็จ");
      setTitle("");
      setExcerpt("");
      setContent("");
      setCoverImage("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "ไม่สามารถบันทึกบทความได้");
    }
  };

  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-slate-50 py-6">
        <div className="container space-y-4">
          <div>
            <p className="text-sm font-medium text-emerald-700">CMS</p>
            <h1 className="text-3xl font-bold text-slate-900">Content Studio</h1>
            <p className="mt-2 text-sm text-slate-600">
              พื้นที่สร้าง/แก้ไขบทความแบบ Rich Text (เริ่มต้นด้วย HTML/Markdown ใน Textarea)
            </p>
          </div>

          <Card className="grid gap-4 rounded-2xl border-slate-200 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
                <Input value={slug} readOnly className="bg-slate-50" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                <Input value={category} onChange={(event) => setCategory(event.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Cover Image URL</label>
                <Input value={coverImage} onChange={(event) => setCoverImage(event.target.value)} />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Excerpt</label>
              <Textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="min-h-20" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
              <Textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="min-h-64 font-mono text-sm"
                placeholder="พิมพ์เนื้อหาแบบ HTML/Markdown และใส่ #hashtags ได้"
              />
            </div>

            {message && <p className="text-sm font-medium text-emerald-700">{message}</p>}
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}

            <div className="flex justify-end">
              <Button onClick={submit} disabled={createArticle.isPending || !title || !content}>
                {createArticle.isPending ? "กำลังบันทึก..." : "บันทึกบทความ"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AdminRouteGuard>
  );
}
