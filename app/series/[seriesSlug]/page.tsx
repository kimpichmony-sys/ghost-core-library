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
      <section className="grid gap-8 rounded-[2rem] border border-orange-100 bg-white p-5 shadow-xl shadow-orange-950/8 sm:p-7 lg:grid-cols-[20rem_1fr]">
        <aside>
          <div className="overflow-hidden rounded-3xl border border-orange-100 bg-orange-50 shadow-xl shadow-orange-950/10">
            <div className="relative aspect-[2/3]">
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
            <span className="rounded-full bg-[#f06a2a] px-3 py-1 font-black text-white">
              {series.status}
            </span>
            <span className="font-semibold text-stone-500">
              {series.books.length} book{series.books.length === 1 ? "" : "s"}
            </span>
            <span className="font-semibold text-stone-500">{chapterCount} chapters</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">
            {series.title}
          </h1>
          <p className="mt-3 text-lg font-medium text-stone-600">by {series.author}</p>
          <div className="mt-5">
            <GenreChips genres={series.genres} />
          </div>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-700">
            {series.description}
          </p>
          {latestChapter ? (
            <p className="mt-5 text-sm font-medium text-stone-600">
              Latest:{" "}
              <Link
                className="font-black text-[#df3f21] transition hover:text-[#f06a2a]"
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
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#f06a2a] px-5 font-black text-white shadow-lg shadow-orange-700/20 transition hover:bg-[#df3f21]"
              >
                Start Reading
              </Link>
            ) : (
              <span className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-orange-100 px-5 text-stone-500">
                No chapters yet
              </span>
            )}
            <ContinueReadingButton seriesSlug={series.slug} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm shadow-orange-950/5">
        <div className="border-b border-stone-100 p-5">
          <h2 className="text-2xl font-black tracking-tight text-stone-950">Books</h2>
        </div>
        {series.books.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {series.books.map((book) => (
              <Link
                key={book.bookSlug}
                href={`/series/${series.slug}/${book.bookSlug}`}
                className="grid gap-3 p-5 transition hover:bg-orange-50 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <p className="text-sm font-black text-[#df3f21]">
                    Book {book.bookNumber} · {book.status}
                  </p>
                  <h3 className="mt-1 text-lg font-black text-stone-950">{book.title}</h3>
                  <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-stone-600">
                    {book.description}
                  </p>
                </div>
                <span className="text-sm font-semibold text-stone-500">
                  {book.chapters.length} chapters
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-stone-500">
            No books yet. Add book folders under this series.
          </div>
        )}
      </section>
    </div>
  );
}
