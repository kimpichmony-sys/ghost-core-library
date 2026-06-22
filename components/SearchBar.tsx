"use client";

type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  compact?: boolean;
};

export function SearchBar({ value = "", onChange, compact = false }: SearchBarProps) {
  return (
    <label className="block">
      <span className="sr-only">Search novels</span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        readOnly={!onChange}
        onFocus={(event) => {
          if (!onChange) {
            event.currentTarget.blur();
            window.location.href = "/#discover";
          }
        }}
        placeholder={compact ? "Search novels..." : "Search by title, author, genre, or synopsis..."}
        className={`w-full rounded-2xl border border-orange-100 bg-white px-4 text-stone-900 shadow-sm shadow-orange-950/5 outline-none transition placeholder:text-stone-400 focus:border-[#f06a2a] focus:ring-4 focus:ring-orange-100 ${
          compact ? "min-h-11 text-sm" : "min-h-13"
        }`}
      />
    </label>
  );
}
