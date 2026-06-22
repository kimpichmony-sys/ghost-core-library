import Link from "next/link";
import type { LatestChapter } from "@/lib/types";

type LatestChaptersProps = {
  chapters: LatestChapter[];
};

export function LatestChapters({ chapters }: LatestChaptersProps) {
  return (
    <section id="latest" className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm shadow-orange-950/5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black tracking-tight text-stone-950">Latest Chapters</h2>
      </div>
      {chapters.length > 0 ? (
        <div className="divide-y divide-stone-100">
          {chapters.map((chapter) => (
            <Link
              key={`${chapter.seriesSlug}-${chapter.bookSlug}-${chapter.chapterSlug}`}
              href={`/series/${chapter.seriesSlug}/${chapter.bookSlug}/chapter/${chapter.chapterSlug}`}
              className="grid gap-1 rounded-2xl py-4 transition hover:bg-orange-50/70 sm:px-3"
            >
              <span className="text-sm font-medium text-stone-500">
                {chapter.seriesTitle} · Book {chapter.bookNumber}
              </span>
              <span className="font-bold text-stone-950">{chapter.chapterTitle}</span>
              <span className="text-sm font-semibold text-[#df3f21]">
                Chapter {chapter.chapterNumber} · {chapter.date}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-orange-200 p-6 text-center text-stone-500">
          No chapters published yet.
        </p>
      )}
    </section>
  );
}
