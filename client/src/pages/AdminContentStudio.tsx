import { ChangeEvent, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import { RichTextEditor } from "@/components/RichTextEditor";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fileToBase64(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }
      const base64 = result.split(",")[1];
      resolve(base64 ?? "");
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
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
  const uploadFile = trpc.files.upload.useMutation();

  const submit = async () => {
    setMessage("");
    setError("");
    try {
      const markdownContent = content
        .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n")
        .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n")
        .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
        .replace(/<em>(.*?)<\/em>/gi, "*$1*")
        .replace(/<li>(.*?)<\/li>/gi, "- $1\n")
        .replace(/<[^>]+>/g, "")
        .trim();

      await createArticle.mutateAsync({
        title,
        slug,
        excerpt,
        category,
        content: markdownContent,
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

  const handleUploadCover = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setMessage("");

    try {
      const fileData = await fileToBase64(file);
      const uploaded = await uploadFile.mutateAsync({
        fileName: file.name,
        fileData,
        mimeType: file.type || "application/octet-stream",
        fileSize: file.size,
        category: "resources",
        description: "article-cover",
        isPublic: true,
      });

      setCoverImage(uploaded.fileUrl);
      setMessage("อัปโหลดรูปปกสำเร็จ");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "อัปโหลดรูปไม่สำเร็จ");
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
              สร้างบทความด้วย Rich Text Editor และบันทึกเป็น Markdown เพื่อแสดงผลบนหน้า Article Detail
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Upload Cover Image</label>
              <Input type="file" accept="image/*" onChange={handleUploadCover} />
              <p className="text-xs text-slate-500">ไฟล์จะถูกอัปโหลดผ่าน files API และบันทึก metadata ลงตาราง files อัตโนมัติ</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Excerpt</label>
              <Textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="min-h-20" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Content (Rich Text)</label>
              <RichTextEditor value={content} onChange={setContent} />
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
