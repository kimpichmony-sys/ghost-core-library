import { NovelCard } from "@/components/NovelCard";
import type { Series } from "@/lib/types";

type SeriesCardProps = {
  series: Series;
  featured?: boolean;
};

export function SeriesCard({ series, featured = false }: SeriesCardProps) {
  return <NovelCard series={series} featured={featured} />;
}
