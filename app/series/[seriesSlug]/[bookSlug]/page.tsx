import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterList } from "@/components/ChapterList";
import { ContinueReadingButton } from "@/components/ContinueReadingButton";
import { NovelCover } from "@/components/NovelCover";
import {
  getAllSeries,
  getBookBySlug,
  getBooksBySeriesSlug,
  getSeriesBySlug,
} from "@/lib/content";

type BookPageProps = {
  params: Promise<{ seriesSlug: string; bookSlug: string }>;
};

export function generateStaticParams() {
  return getAllSeries().flatMap((series) =>
    series.books.map((book) => ({
      seriesSlug: series.slug,
      bookSlug: book.bookSlug,
    })),
  );
}

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { seriesSlug, bookSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);
  const book = getBookBySlug(seriesSlug, bookSlug);

  if (!series || !book) {
    return {
      title: "Book not found",
    };
  }

  return {
    title: `${book.title} | ${series.title}`,
    description: book.description,
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { seriesSlug, bookSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);
  const book = getBookBySlug(seriesSlug, bookSlug);

  if (!series || !book) {
    notFound();
  }

  const firstChapter = book.chapters[0];
  const allBooks = getBooksBySeriesSlug(series.slug);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[20rem_1fr] lg:px-8">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-3xl border border-orange-100 bg-orange-50 shadow-xl shadow-orange-950/10">
          <div className="relative aspect-[2/3]">
            <NovelCover src={book.cover} alt={`${book.title} cover`} priority />
          </div>
        </div>
      </aside>

      <section className="flex flex-col gap-8">
        <div className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-xl shadow-orange-950/8 sm:p-7">
          <Link
            href={`/series/${series.slug}`}
            className="mb-5 inline-flex text-sm font-black text-[#df3f21] transition hover:text-[#f06a2a]"
          >
            Back to series
          </Link>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-[#f06a2a] px-3 py-1 font-black text-white">
              {book.status}
            </span>
            <span className="font-semibold text-stone-500">Book {book.bookNumber}</span>
            <span className="font-semibold text-stone-500">{book.chapters.length} chapters</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">
            {book.title}
          </h1>
          <p className="mt-3 text-lg font-medium text-stone-600">{series.title}</p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-700">
            {book.description}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {firstChapter ? (
              <Link
                href={`/series/${series.slug}/${book.bookSlug}/chapter/${firstChapter.slug}`}
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
          {allBooks.length > 1 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {allBooks.map((seriesBook) => (
                <Link
                  key={seriesBook.bookSlug}
                  href={`/series/${series.slug}/${seriesBook.bookSlug}`}
                  className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                    seriesBook.bookSlug === book.bookSlug
                      ? "border-[#f06a2a] bg-orange-50 text-[#df3f21]"
                      : "border-orange-100 text-stone-600 hover:bg-orange-50"
                  }`}
                >
                  Book {seriesBook.bookNumber}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <ChapterList
          seriesSlug={series.slug}
          bookSlug={book.bookSlug}
          chapters={book.chapters}
        />
      </section>
    </div>
  );
}
