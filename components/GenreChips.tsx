type GenreChipsProps = {
  genres: string[];
};

export function GenreChips({ genres }: GenreChipsProps) {
  if (genres.length === 0) {
    return <p className="text-sm text-stone-500">No genres yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <span
          key={genre}
          className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-sm font-bold text-[#b54a22]"
        >
          {genre}
        </span>
      ))}
    </div>
  );
}
