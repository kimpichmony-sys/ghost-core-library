import type { Metadata } from "next";
import { GenreChips } from "@/components/GenreChips";
import { HomeSearch } from "@/components/HomeSearch";
import { LatestChapters } from "@/components/LatestChapters";
import { SeriesCard } from "@/components/SeriesCard";
import { getAllSeries, getLatestChapters } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ghost Core Library",
  description: "Read the Ghost Core Ascension series.",
};

export default function HomePage() {
  const seriesList = getAllSeries();
  const latestChapters = getLatestChapters(6);
  const allGenres = Array.from(
    new Set(seriesList.flatMap((series) => series.genres)),
  ).sort();
  const featuredSeries = seriesList[0];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-[#0d1621]/80 p-5 shadow-2xl shadow-black/30 backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <div className="flex flex-col justify-center gap-6">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#8eb7ff]">
              Original Webnovels
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
              A premium shelf for Ghost Core Ascension.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Browse chapters, tune the reader, and pick up where you stopped.
            </p>
          </div>
          <HomeSearch seriesList={seriesList} />
        </div>
        {featuredSeries ? (
          <div className="rounded-3xl border border-[#e7c873]/25 bg-gradient-to-br from-[#192331] to-[#0b1119] p-4">
            <SeriesCard series={featuredSeries} featured />
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-slate-300">
            Add a series in content/series to feature it here.
          </div>
        )}
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="mb-4 text-xl font-semibold text-white">Genres</h2>
          <GenreChips genres={allGenres} />
        </div>
        <LatestChapters chapters={latestChapters} />
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#e7c873]">
              Library
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">All Series</h2>
          </div>
        </div>
        {seriesList.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {seriesList.map((series) => (
              <SeriesCard key={series.slug} series={series} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.04] p-8 text-center text-slate-300">
            No series yet. Create a folder in content/series to begin.
          </div>
        )}
      </section>
    </div>
  );
}
