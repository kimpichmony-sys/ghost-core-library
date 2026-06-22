import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContinueReadingButton } from "@/components/ContinueReadingButton";
import { GenreChips } from "@/components/GenreChips";
import { NovelCover } from "@/components/NovelCover";
import { getAllSeries, getLatestChapters, getSeriesBySlug } from "@/lib/content";

type SeriesPageProps = {
  params: Promise<{ seriesSlug: string }>;
};

export function generateStaticParams() {
  return getAllSeries().map((series) => ({
    seriesSlug: series.slug,
  }));
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { seriesSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);

  if (!series) {
    return {
      title: "Series not found",
    };
  }

  return {
    title: `${series.title} | Ghost Core Library`,
    description: series.description,
  };
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { seriesSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);

  if (!series) {
    notFound();
  }

  const firstBook = series.books[0];
  const firstChapter = firstBook?.chapters[0];
  const latestChapter = getLatestChapters(1).find(
    (chapter) => chapter.seriesSlug === series.slug,
  );
  const chapterCount = series.books.reduce(
    (total, book) => total + book.chapters.length,
    0,
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 rounded-2xl border border-white/10 bg-[#0d1621]/80 p-5 sm:p-7 lg:grid-cols-[20rem_1fr]">
        <aside>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/25">
            <div className="relative aspect-[2/3] bg-[#111c28]">
              <NovelCover
                src={series.cover}
                alt={`${series.title} cover`}
                priority
              />
            </div>
          </div>
        </aside>
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-[#e7c873]/30 bg-[#e7c873]/10 px-3 py-1 font-medium text-[#f5d884]">
              {series.status}
            </span>
            <span className="text-slate-400">
              {series.books.length} book{series.books.length === 1 ? "" : "s"}
            </span>
            <span className="text-slate-400">{chapterCount} chapters</span>
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-5xl">{series.title}</h1>
          <p className="mt-3 text-lg text-slate-300">by {series.author}</p>
          <div className="mt-5">
            <GenreChips genres={series.genres} />
          </div>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">
            {series.description}
          </p>
          {latestChapter ? (
            <p className="mt-5 text-sm text-slate-300">
              Latest:{" "}
              <Link
                className="font-semibold text-[#f2d889] transition hover:text-white"
                href={`/series/${series.slug}/${latestChapter.bookSlug}/chapter/${latestChapter.chapterSlug}`}
              >
                Book {latestChapter.bookNumber}, {latestChapter.chapterTitle}
              </Link>
            </p>
          ) : null}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {firstBook && firstChapter ? (
              <Link
                href={`/series/${series.slug}/${firstBook.bookSlug}/chapter/${firstChapter.slug}`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#e7c873] px-5 font-semibold text-[#10151d] transition hover:bg-[#f4dc91]"
              >
                Start Reading
              </Link>
            ) : (
              <span className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-5 text-slate-400">
                No chapters yet
              </span>
            )}
            <ContinueReadingButton seriesSlug={series.slug} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04]">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-2xl font-bold text-white">Books</h2>
        </div>
        {series.books.length > 0 ? (
          <div className="divide-y divide-white/10">
            {series.books.map((book) => (
              <Link
                key={book.bookSlug}
                href={`/series/${series.slug}/${book.bookSlug}`}
                className="grid gap-3 p-5 transition hover:bg-white/[0.04] sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="text-sm font-medium text-[#e7c873]">
                    Book {book.bookNumber} · {book.status}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{book.title}</h3>
                  <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-300">
                    {book.description}
                  </p>
                </div>
                <span className="text-sm text-slate-400">
                  {book.chapters.length} chapters
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-300">
            No books yet. Add book folders under this series.
          </div>
        )}
      </section>
    </div>
  );
}
