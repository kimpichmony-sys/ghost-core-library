"use client";

export const READER_THEMES = {
  paper: {
    label: "Paper Yellow",
    background: "#F4E6B8",
    text: "#1F1A12",
  },
  cream: {
    label: "Cream",
    background: "#F7F1E3",
    text: "#2A2118",
  },
  white: {
    label: "Pure White",
    background: "#FFFFFF",
    text: "#111111",
  },
  black: {
    label: "Night Black",
    background: "#050505",
    text: "#F5F5F5",
  },
  blackGold: {
    label: "Black Gold",
    background: "#050505",
    text: "#F5D76E",
  },
  darkBlue: {
    label: "Dark Blue",
    background: "#0B1020",
    text: "#E6EDF7",
  },
} as const;

export type ReaderThemeKey = keyof typeof READER_THEMES;

type ReaderThemeSelectorProps = {
  value: ReaderThemeKey;
  onChange: (theme: ReaderThemeKey) => void;
};

export function ReaderThemeSelector({ value, onChange }: ReaderThemeSelectorProps) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-black text-stone-800">Theme</legend>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(READER_THEMES).map(([themeKey, theme]) => {
          const key = themeKey as ReaderThemeKey;
          const isSelected = value === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`flex min-h-14 items-center gap-3 rounded-2xl border p-2 text-left text-sm font-bold transition ${
                isSelected
                  ? "border-[#f06a2a] bg-orange-50 text-stone-950"
                  : "border-stone-200 bg-white text-stone-600 hover:border-orange-200"
              }`}
              aria-pressed={isSelected}
            >
              <span
                className="size-8 shrink-0 rounded-full border border-stone-200"
                style={{ background: theme.background, color: theme.text }}
              >
                <span className="grid size-full place-items-center text-xs font-black">A</span>
              </span>
              <span>{theme.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
