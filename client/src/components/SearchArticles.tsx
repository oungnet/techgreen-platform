import { useState } from "react";
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
  
  const { data: results = [], isLoading } = trpc.articles.search.useQuery(
    { query: searchQuery || "", limit: 10 },
    { enabled: !!searchQuery }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setHasSearched(true);
    setSearchQuery(query);
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="ค้นหาบทความ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      {hasSearched && (
        <div className="space-y-3">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ไม่พบบทความที่ตรงกับ "{query}"
            </div>
          )}

          {results.map((article: typeof results[0]) => (
            <Card 
              key={article.id} 
              className="p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => onArticleSelect?.(article.id)}
            >
              <h3 className="font-semibold text-slate-900 mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  {article.category}
                </span>
                <span>{article.viewCount} views</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
