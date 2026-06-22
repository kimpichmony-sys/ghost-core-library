type GenreChipsProps = {
  genres: string[];
};

export function GenreChips({ genres }: GenreChipsProps) {
  if (genres.length === 0) {
    return <p className="text-sm text-slate-400">No genres yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <span
          key={genre}
          className="rounded-full border border-[#8eb7ff]/25 bg-[#8eb7ff]/10 px-3 py-1 text-sm font-medium text-[#bcd3ff]"
        >
          {genre}
        </span>
      ))}
    </div>
  );
}
