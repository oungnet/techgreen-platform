import { useMemo } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MarkdownArticle } from "@/components/MarkdownArticle";
import { ArticleComments } from "@/components/ArticleComments";
import { ArticleRating } from "@/components/ArticleRating";

export default function ArticleDetail() {
  const [matched, params] = useRoute("/learning/:slug");
  const slug = useMemo(() => (matched ? params?.slug ?? "" : ""), [matched, params]);

  const { data, isLoading, error } = trpc.articles.getBySlug.useQuery(
    { slug },
    {
      enabled: Boolean(slug),
    }
  );

  if (!matched) return null;

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card className="space-y-4 p-6">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-10/12" />
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-8">
        <Card className="p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900">ไม่พบบทความ</h1>
          <p className="mt-2 text-sm text-slate-600">ลิงก์อาจไม่ถูกต้อง หรือบทความถูกนำออกแล้ว</p>
          <Button className="mt-4" onClick={() => (window.location.href = "/learning")}>กลับหน้า Content Hub</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-6">
      <div className="container max-w-4xl space-y-6">
        <Card className="rounded-2xl border-slate-200 p-6 md:p-8">
          <p className="mb-2 text-sm font-medium text-emerald-700">{data.category}</p>
          <h1 className="text-2xl font-bold text-slate-900 md:text-4xl">{data.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span>ผู้เขียน #{data.authorId}</span>
            <span>{new Date(data.createdAt).toLocaleString("th-TH")}</span>
          </div>
          <div className="mt-6">
            <MarkdownArticle markdown={data.content} />
          </div>
          <div className="mt-8 rounded-xl bg-slate-100 p-4">
            <ArticleRating articleId={data.id} />
          </div>
        </Card>

        <Card className="rounded-2xl border-slate-200 p-6 md:p-8">
          <ArticleComments articleId={data.id} />
        </Card>
      </div>
    </div>
  );
}
