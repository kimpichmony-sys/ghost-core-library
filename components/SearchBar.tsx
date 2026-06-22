"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="block">
      <span className="sr-only">Search novels</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, author, genre, or synopsis..."
        className="min-h-13 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[#8eb7ff]/70 focus:bg-white/[0.09]"
      />
    </label>
  );
}
