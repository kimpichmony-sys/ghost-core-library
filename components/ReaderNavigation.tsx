import Link from "next/link";
import type { Chapter } from "@/lib/types";

type ChapterTarget = {
  bookSlug: string;
  chapter: Chapter;
};

type ReaderNavigationProps = {
  seriesSlug: string;
  bookSlug: string;
  previous: ChapterTarget | null;
  next: ChapterTarget | null;
};

export function ReaderNavigation({
  seriesSlug,
  bookSlug,
  previous,
  next,
}: ReaderNavigationProps) {
  return (
    <>
      <nav className="grid gap-3 sm:grid-cols-3">
        <ChapterLink target={previous} seriesSlug={seriesSlug} label="Previous" />
        <Link
          href={`/series/${seriesSlug}/${bookSlug}`}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-current/20 px-4 font-semibold transition hover:bg-current/5"
        >
          Chapter List
        </Link>
        <ChapterLink target={next} seriesSlug={seriesSlug} label="Next" alignRight />
      </nav>
      <nav className="reader-mobile-nav fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 gap-2 border-t border-current/10 p-3 backdrop-blur md:hidden">
        <MobileChapterLink target={previous} seriesSlug={seriesSlug} label="Prev" />
        <Link
          href={`/series/${seriesSlug}/${bookSlug}`}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-current/15 px-3 text-sm font-semibold"
        >
          List
        </Link>
        <MobileChapterLink target={next} seriesSlug={seriesSlug} label="Next" />
      </nav>
    </>
  );
}

function ChapterLink({
  target,
  seriesSlug,
  label,
  alignRight = false,
}: {
  target: ChapterTarget | null;
  seriesSlug: string;
  label: string;
  alignRight?: boolean;
}) {
  if (!target) {
    return (
      <span className="inline-flex min-h-12 items-center justify-center rounded-xl border border-current/10 px-4 text-sm opacity-45">
        No {label.toLowerCase()} chapter
      </span>
    );
  }

  return (
    <Link
      href={`/series/${seriesSlug}/${target.bookSlug}/chapter/${target.chapter.slug}`}
      className={`inline-flex min-h-12 flex-col justify-center rounded-xl border border-current/20 px-4 transition hover:bg-current/5 ${
        alignRight ? "items-end text-right" : ""
      }`}
    >
      <span className="text-xs uppercase tracking-[0.18em] opacity-60">{label}</span>
      <span className="line-clamp-1 font-semibold">{target.chapter.title}</span>
    </Link>
  );
}

function MobileChapterLink({
  target,
  seriesSlug,
  label,
}: {
  target: ChapterTarget | null;
  seriesSlug: string;
  label: string;
}) {
  if (!target) {
    return (
      <span className="inline-flex min-h-11 items-center justify-center rounded-xl border border-current/10 px-3 text-sm opacity-45">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={`/series/${seriesSlug}/${target.bookSlug}/chapter/${target.chapter.slug}`}
      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-current/15 px-3 text-sm font-semibold"
    >
      {label}
    </Link>
  );
}
