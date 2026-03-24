import { Clock3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

type ContentHubCardProps = {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string | null;
  authorId: number;
  createdAt: Date | string;
};

export function ContentHubCard(props: ContentHubCardProps) {
  const readingMinutes = Math.max(1, Math.ceil((props.excerpt?.length ?? 120) / 140));

  return (
    <Link href={`/learning/${props.slug}`}>
      <Card className="h-full border-slate-200 bg-gradient-to-br from-white via-white to-slate-100/70 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {props.category}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-slate-900">{props.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">
          {props.excerpt || "No summary available for this article yet."}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span>Author ID: {props.authorId}</span>
          <span>
            {new Date(props.createdAt).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 size={14} />
            {readingMinutes} นาที
          </span>
        </div>
      </Card>
    </Link>
  );
}
