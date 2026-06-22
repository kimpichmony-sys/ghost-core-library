"use client";

import { useMemo, useState } from "react";
import type { Series } from "@/lib/types";
import { SeriesCard } from "@/components/SeriesCard";
import { SearchBar } from "@/components/SearchBar";

type HomeSearchProps = {
  seriesList: Series[];
};

export function HomeSearch({ seriesList }: HomeSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return seriesList.filter((series) => {
      const searchableText = [
        series.title,
        series.author,
        series.description,
        series.genres.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [seriesList, query]);

  return (
    <div className="relative">
      <SearchBar value={query} onChange={setQuery} />
      {query.trim() ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 max-h-[70vh] overflow-auto rounded-3xl border border-orange-100 bg-white p-3 shadow-2xl shadow-orange-950/15">
          {results.length > 0 ? (
            <div className="grid gap-3">
              {results.map((series) => (
                <SeriesCard key={series.slug} series={series} />
              ))}
            </div>
          ) : (
            <p className="p-5 text-center text-stone-500">No matching series found.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
