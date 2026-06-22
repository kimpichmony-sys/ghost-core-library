import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterContent } from "@/components/ChapterContent";
import { ReadAloudControls } from "@/components/ReadAloudControls";
import { ReaderNavigation } from "@/components/ReaderNavigation";
import { ReaderProgressSaver } from "@/components/ReaderProgressSaver";
import { ReaderSettingsPanel } from "@/components/ReaderSettingsPanel";
import { ReaderLayout } from "@/components/ReaderLayout";
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
    <ReaderLayout>
      <ReaderProgressSaver
        seriesSlug={series.slug}
        bookSlug={book.bookSlug}
        chapterSlug={chapter.slug}
        chapterNumber={chapter.chapter}
        chapterTitle={chapter.title}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="sticky top-16 z-30 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-current/10 bg-[var(--reader-background)] px-4 py-3 text-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <Link
            href={`/series/${series.slug}/${book.bookSlug}`}
            className="rounded-full border border-current/20 px-4 py-2 font-black opacity-85 transition hover:bg-current/5 hover:opacity-100"
          >
            Back to book
          </Link>
          <div className="min-w-0 flex-1 text-center max-sm:order-3 max-sm:basis-full">
            <p className="truncate text-sm font-black">{chapter.title}</p>
          </div>
          <ReaderSettingsPanel />
        </div>

        <ReadAloudControls text={chapter.content} />

        <article className="mx-auto w-full">
          <div className="reader-content-card mx-auto w-full px-1 pt-6 text-center sm:px-4">
            <p className="mb-2 text-sm font-black uppercase tracking-[0.22em] opacity-65">
            {series.title}
            </p>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] opacity-50">
              Book {book.bookNumber}
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              {chapter.title}
            </h1>
            <p className="mt-3 text-sm font-semibold opacity-60">
              Chapter {chapter.chapter} · {chapter.date}
            </p>
          </div>
          <ChapterContent content={chapter.content} />
        </article>

        <ReaderNavigation
          seriesSlug={series.slug}
          bookSlug={book.bookSlug}
          previous={previous}
          next={next}
        />
      </div>
    </ReaderLayout>
  );
}
