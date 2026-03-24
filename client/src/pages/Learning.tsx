import { useEffect, useMemo, useState } from "react";
import { Search, Menu, X, AlertCircle, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { ContentHubCard } from "@/components/ContentHubCard";

const PAGE_SIZE = 8;
type FeedArticle = {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string | null;
  authorId: number;
  createdAt: Date | string;
};

export default function Learning() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, activeCategory, activeTag]);

  const listInput = useMemo(
    () => ({
      limit: PAGE_SIZE,
      offset: (currentPage - 1) * PAGE_SIZE,
      search: debouncedSearchTerm || undefined,
      category: activeCategory === "All" ? undefined : activeCategory,
      tag: activeTag ?? undefined,
    }),
    [activeCategory, activeTag, currentPage, debouncedSearchTerm]
  );

  const { data, isLoading, error, isFetching, refetch: refetchFeed } = trpc.articles.feed.useQuery(listInput);
  const { data: categoryData = [], refetch: refetchCategories } = trpc.articles.categories.useQuery(undefined, {
    staleTime: 60_000,
  });
  const { data: tagData = [], refetch: refetchTags } = trpc.articles.tags.useQuery({ limit: 50 }, { staleTime: 60_000 });

  const categories = useMemo(() => ["All", ...categoryData], [categoryData]);
  const tags = useMemo(() => tagData, [tagData]);
  const items: FeedArticle[] = (data?.items ?? []) as FeedArticle[];
  const hasPrevious = currentPage > 1;
  const hasNext = Boolean(data?.hasNext);

  const handleRetry = () => {
    void Promise.all([refetchFeed(), refetchCategories(), refetchTags()]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">TG</div>
              <div>
                <p className="text-sm font-medium text-slate-500">TechGreen</p>
                <h1 className="text-lg font-bold text-slate-900">Content Hub</h1>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 lg:hidden"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
              Filters
            </button>
          </div>

          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="ค้นหาบทความ หัวข้อ หรือแท็ก"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside className={`${isSidebarOpen ? "block" : "hidden"} rounded-xl border border-slate-200 bg-white p-4 lg:block`}>
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-slate-500">Categories</h2>
            <div className="mt-3 space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    activeCategory === category
                      ? "bg-emerald-50 font-semibold text-emerald-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-500">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    activeTag === tag
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-sm text-slate-600">
              พบ <span className="font-semibold text-slate-900">{items.length}</span> บทความ
            </p>
            {activeTag && (
              <button
                type="button"
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                onClick={() => setActiveTag(null)}
              >
                Clear tag: #{activeTag}
              </button>
            )}
          </div>

          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="border-slate-200 p-5">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="mt-3 h-7 w-4/5" />
                  <div className="mt-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle />
              <AlertTitle>ไม่สามารถโหลดบทความได้</AlertTitle>
              <AlertDescription>
                ระบบดึงข้อมูลไม่สำเร็จ กรุณาลองใหม่
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 border-red-300 bg-white text-red-700 hover:bg-red-100"
                  onClick={handleRetry}
                >
                  <RotateCcw className="mr-2" size={14} />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((article) => (
                  <ContentHubCard key={article.id} {...article} />
                ))}
              </div>

              {items.length === 0 && (
                <Card className="border-slate-200 p-8 text-center">
                  <p className="text-sm text-slate-600">ไม่พบบทความที่ตรงกับเงื่อนไขการค้นหา</p>
                </Card>
              )}

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={!hasPrevious || isFetching}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <p className="text-sm text-slate-600">หน้า {currentPage}</p>
                <Button type="button" variant="outline" disabled={!hasNext || isFetching} onClick={() => setCurrentPage((prev) => prev + 1)}>
                  Next
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
