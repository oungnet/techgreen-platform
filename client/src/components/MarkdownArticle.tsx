import { useMemo } from "react";
import { markdownToHtml } from "@/lib/markdown";

type MarkdownArticleProps = {
  markdown: string;
};

export function MarkdownArticle({ markdown }: MarkdownArticleProps) {
  const html = useMemo(() => markdownToHtml(markdown), [markdown]);

  return (
    <article
      className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-emerald-700 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-pre:bg-slate-900 prose-pre:text-slate-100"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
