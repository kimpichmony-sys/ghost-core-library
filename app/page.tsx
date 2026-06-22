import type { Metadata } from "next";
import { GenreChips } from "@/components/GenreChips";
import { HomeSearch } from "@/components/HomeSearch";
import { LatestChapters } from "@/components/LatestChapters";
import { NovelCard } from "@/components/NovelCard";
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
      <section
        id="discover"
        className="grid gap-8 rounded-[2rem] border border-orange-100 bg-white p-5 shadow-xl shadow-orange-950/8 md:grid-cols-[1.05fr_0.95fr] md:p-8"
      >
        <div className="flex flex-col justify-center gap-6">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-[#df3f21]">
              Original Webnovels
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-stone-950 sm:text-5xl">
              Read Ghost Core Ascension chapter by chapter.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
              A bright, mobile-friendly reading shelf for original progression fantasy.
              Browse books, jump into the newest chapter, and keep your reader settings.
            </p>
          </div>
          <HomeSearch seriesList={seriesList} />
        </div>
        {featuredSeries ? (
          <div>
            <NovelCard series={featuredSeries} featured />
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-3xl border border-dashed border-orange-200 bg-orange-50 p-8 text-center text-stone-500">
            Add a series in content/series to feature it here.
          </div>
        )}
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm shadow-orange-950/5">
          <h2 className="mb-4 text-xl font-black tracking-tight text-stone-950">Genres</h2>
          <GenreChips genres={allGenres} />
        </div>
        <LatestChapters chapters={latestChapters} />
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#df3f21]">
              Library
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950">
              All Series
            </h2>
          </div>
        </div>
        {seriesList.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {seriesList.map((series) => (
              <NovelCard key={series.slug} series={series} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-orange-200 bg-white p-8 text-center text-stone-500">
            No series yet. Create a folder in content/series to begin.
          </div>
        )}
      </section>
    </div>
  );
}
