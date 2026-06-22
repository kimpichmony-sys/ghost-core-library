import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ReadAloudControls } from "@/components/ReadAloudControls";
import { ReaderNavigation } from "@/components/ReaderNavigation";
import { ReaderProgressSaver } from "@/components/ReaderProgressSaver";
import { ReaderSettingsPanel } from "@/components/ReaderSettingsPanel";
import { ReaderShell } from "@/components/ReaderShell";
import {
  getAllSeries,
  getBookBySlug,
  getChapterBySlug,
  getPreviousAndNextChapter,
  getSeriesBySlug,
} from "@/lib/content";

type ChapterPageProps = {
  params: Promise<{ seriesSlug: string; bookSlug: string; chapterSlug: string }>;
};

export function generateStaticParams() {
  return getAllSeries().flatMap((series) =>
    series.books.flatMap((book) =>
      book.chapters.map((chapter) => ({
        seriesSlug: series.slug,
        bookSlug: book.bookSlug,
        chapterSlug: chapter.slug,
      })),
    ),
  );
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const { seriesSlug, bookSlug, chapterSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);
  const book = getBookBySlug(seriesSlug, bookSlug);
  const chapter = getChapterBySlug(seriesSlug, bookSlug, chapterSlug);

  if (!series || !book || !chapter) {
    return {
      title: "Chapter not found",
    };
  }

  return {
    title: `${series.title} - ${book.title} - ${chapter.title}`,
    description: `Read ${chapter.title} from ${book.title}.`,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { seriesSlug, bookSlug, chapterSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);
  const book = getBookBySlug(seriesSlug, bookSlug);
  const chapter = getChapterBySlug(seriesSlug, bookSlug, chapterSlug);

  if (!series || !book || !chapter) {
    notFound();
  }

  const { previous, next } = getPreviousAndNextChapter(
    seriesSlug,
    bookSlug,
    chapterSlug,
  );

  return (
    <ReaderShell>
      <ReaderProgressSaver
        seriesSlug={series.slug}
        bookSlug={book.bookSlug}
        chapterSlug={chapter.slug}
        chapterNumber={chapter.chapter}
        chapterTitle={chapter.title}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link
            href={`/series/${series.slug}/${book.bookSlug}`}
            className="rounded-full border border-current px-4 py-2 opacity-80 transition hover:opacity-100"
          >
            Back to book
          </Link>
          <ReaderSettingsPanel />
        </div>

        <ReadAloudControls text={chapter.content} />

        <article className="mx-auto w-full rounded-2xl border border-current/10 px-5 py-8 shadow-xl shadow-black/10 sm:px-10 sm:py-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] opacity-65">
            {series.title}
          </p>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] opacity-50">
            Book {book.bookNumber}
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{chapter.title}</h1>
          <p className="mt-3 text-sm opacity-60">
            Chapter {chapter.chapter} · {chapter.date}
          </p>
          <div className="mt-10">
            <MarkdownContent content={chapter.content} />
          </div>
        </article>

        <ReaderNavigation
          seriesSlug={series.slug}
          bookSlug={book.bookSlug}
          previous={previous}
          next={next}
        />
      </div>
    </ReaderShell>
  );
}
