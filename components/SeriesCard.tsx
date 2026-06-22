import Link from "next/link";
import type { Series } from "@/lib/types";
import { GenreChips } from "@/components/GenreChips";
import { NovelCover } from "@/components/NovelCover";

type SeriesCardProps = {
  series: Series;
  featured?: boolean;
};

export function SeriesCard({ series, featured = false }: SeriesCardProps) {
  const chapterCount = series.books.reduce(
    (total, book) => total + book.chapters.length,
    0,
  );

  return (
    <Link
      href={`/series/${series.slug}`}
      className="group grid h-full grid-cols-[6.5rem_1fr] gap-4 rounded-2xl border border-white/10 bg-[#101923]/80 p-4 transition hover:-translate-y-0.5 hover:border-[#e7c873]/40 hover:bg-[#142131]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#0b1119]">
        <NovelCover
          src={series.cover}
          alt={`${series.title} cover`}
          sizes="160px"
          className="transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-[#e7c873]/12 px-2 py-1 font-semibold text-[#f2d889]">
            {series.status}
          </span>
          <span className="text-slate-400">
            {series.books.length} book{series.books.length === 1 ? "" : "s"}
          </span>
          <span className="text-slate-400">{chapterCount} chapters</span>
        </div>
        <h3 className="line-clamp-2 text-lg font-bold text-white group-hover:text-[#f2d889]">
          {series.title}
        </h3>
        <p className="mt-1 text-sm text-slate-400">by {series.author}</p>
        <p
          className={`mt-3 text-sm leading-6 text-slate-300 ${
            featured ? "line-clamp-4" : "line-clamp-3"
          }`}
        >
          {series.description}
        </p>
        <div className="mt-4">
          <GenreChips genres={series.genres.slice(0, 3)} />
        </div>
      </div>
    </Link>
  );
}
