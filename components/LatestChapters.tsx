import Link from "next/link";
import type { LatestChapter } from "@/lib/types";

type LatestChaptersProps = {
  chapters: LatestChapter[];
};

export function LatestChapters({ chapters }: LatestChaptersProps) {
  return (
    <section id="latest" className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">Latest Chapters</h2>
      </div>
      {chapters.length > 0 ? (
        <div className="divide-y divide-white/10">
          {chapters.map((chapter) => (
            <Link
              key={`${chapter.seriesSlug}-${chapter.bookSlug}-${chapter.chapterSlug}`}
              href={`/series/${chapter.seriesSlug}/${chapter.bookSlug}/chapter/${chapter.chapterSlug}`}
              className="grid gap-1 py-4 transition hover:translate-x-1"
            >
              <span className="text-sm text-slate-400">
                {chapter.seriesTitle} · Book {chapter.bookNumber}
              </span>
              <span className="font-semibold text-white">{chapter.chapterTitle}</span>
              <span className="text-sm text-[#e7c873]">
                Chapter {chapter.chapterNumber} · {chapter.date}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-white/15 p-6 text-center text-slate-300">
          No chapters published yet.
        </p>
      )}
    </section>
  );
}
