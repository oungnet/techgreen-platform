import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface SearchArticlesProps {
  onArticleSelect?: (articleId: number) => void;
}

export function SearchArticles({ onArticleSelect }: SearchArticlesProps) {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const { data, isLoading } = trpc.articles.search.useQuery(
    { query: searchQuery || "", limit: 10 },
    { enabled: !!searchQuery }
  );

  const results = data?.items ?? [];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasSearched(true);
    setSearchQuery(query);
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="ค้นหาบทความ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="bg-green-500 hover:bg-green-600">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {hasSearched && (
        <div className="space-y-3">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
            </div>
          )}

          {!isLoading && results.length === 0 && <div className="py-8 text-center text-gray-500">ไม่พบบทความที่ตรงกับ "{query}"</div>}

          {results.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer p-4 transition hover:shadow-lg"
              onClick={() => onArticleSelect?.(article.id)}
            >
              <h3 className="mb-2 font-semibold text-slate-900">{article.title}</h3>
              <p className="line-clamp-2 text-sm text-gray-600">{article.excerpt}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span className="rounded bg-green-100 px-2 py-1 text-green-700">{article.category}</span>
                <span>{article.viewCount} views</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
