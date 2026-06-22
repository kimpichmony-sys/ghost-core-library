import Link from "next/link";
import type { Chapter } from "@/lib/types";

type ChapterListProps = {
  seriesSlug: string;
  bookSlug: string;
  chapters: Chapter[];
};

export function ChapterList({ seriesSlug, bookSlug, chapters }: ChapterListProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm shadow-orange-950/5">
      <div className="border-b border-stone-100 p-5">
        <h2 className="text-2xl font-black tracking-tight text-stone-950">Chapters</h2>
      </div>
      {chapters.length > 0 ? (
        <div className="divide-y divide-stone-100">
          {chapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/series/${seriesSlug}/${bookSlug}/chapter/${chapter.slug}`}
              className="grid gap-2 p-5 transition hover:bg-orange-50 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <p className="text-sm font-black text-[#df3f21]">Chapter {chapter.chapter}</p>
                <h3 className="mt-1 font-bold text-stone-950">{chapter.title}</h3>
              </div>
              <time className="text-sm font-medium text-stone-500">{chapter.date}</time>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-stone-500">
          No chapters yet. Add Markdown files in this book&apos;s chapters folder.
        </div>
      )}
    </section>
  );
}
