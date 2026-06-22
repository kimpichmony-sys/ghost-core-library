import Link from "next/link";
import type { Chapter } from "@/lib/types";

type ChapterListProps = {
  seriesSlug: string;
  bookSlug: string;
  chapters: Chapter[];
};

export function ChapterList({ seriesSlug, bookSlug, chapters }: ChapterListProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04]">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-2xl font-bold text-white">Chapters</h2>
      </div>
      {chapters.length > 0 ? (
        <div className="divide-y divide-white/10">
          {chapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/series/${seriesSlug}/${bookSlug}/chapter/${chapter.slug}`}
              className="grid gap-2 p-5 transition hover:bg-white/[0.04] sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="text-sm font-medium text-[#e7c873]">Chapter {chapter.chapter}</p>
                <h3 className="mt-1 font-semibold text-white">{chapter.title}</h3>
              </div>
              <time className="text-sm text-slate-400">{chapter.date}</time>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-slate-300">
          No chapters yet. Add Markdown files in this book&apos;s chapters folder.
        </div>
      )}
    </section>
  );
}
