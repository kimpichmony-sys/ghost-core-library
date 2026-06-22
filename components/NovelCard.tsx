import Link from "next/link";
import { GenreChips } from "@/components/GenreChips";
import { NovelCover } from "@/components/NovelCover";
import type { Series } from "@/lib/types";

type NovelCardProps = {
  series: Series;
  featured?: boolean;
};

export function NovelCard({ series, featured = false }: NovelCardProps) {
  const chapterCount = series.books.reduce(
    (total, book) => total + book.chapters.length,
    0,
  );

  return (
    <Link
      href={`/series/${series.slug}`}
      className={`group grid h-full gap-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm shadow-orange-950/5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-950/10 ${
        featured ? "grid-cols-[7rem_1fr] sm:grid-cols-[10rem_1fr]" : "grid-cols-[6.5rem_1fr]"
      }`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-orange-50 ring-1 ring-orange-100">
        <NovelCover
          src={series.cover}
          alt={`${series.title} cover`}
          sizes={featured ? "240px" : "160px"}
          className="transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 self-center">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-[#f06a2a] px-2.5 py-1 font-black text-white">
            {series.status}
          </span>
          <span className="font-semibold text-stone-500">
            {series.books.length} book{series.books.length === 1 ? "" : "s"}
          </span>
          <span className="font-semibold text-stone-500">{chapterCount} chapters</span>
        </div>
        <h3
          className={`line-clamp-2 font-black tracking-tight text-stone-950 group-hover:text-[#df3f21] ${
            featured ? "text-2xl sm:text-3xl" : "text-lg"
          }`}
        >
          {series.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-stone-500">by {series.author}</p>
        <p
          className={`mt-3 text-sm leading-6 text-stone-600 ${
            featured ? "line-clamp-5" : "line-clamp-3"
          }`}
        >
          {series.description}
        </p>
        <div className="mt-4">
          <GenreChips genres={series.genres.slice(0, featured ? 5 : 3)} />
        </div>
      </div>
    </Link>
  );
}
