"use client";

import { useEffect, useState } from "react";

type ReaderSettings = {
  theme: (typeof themeOptions)[number];
  fontSize: (typeof fontSizeOptions)[number];
  fontFamily: (typeof fontFamilyOptions)[number];
  lineHeight: (typeof lineHeightOptions)[number];
  width: (typeof widthOptions)[number];
};

const themeOptions = ["white", "sepia", "dark", "dark-blue"] as const;
const fontSizeOptions = ["16px", "18px", "20px", "22px", "24px", "28px", "32px"] as const;
const fontFamilyOptions = ["serif", "sans-serif", "monospace"] as const;
const lineHeightOptions = ["1.4", "1.6", "1.8", "2.0"] as const;
const widthOptions = ["narrow", "normal", "wide"] as const;

const defaultSettings: ReaderSettings = {
  theme: "dark-blue",
  fontSize: "20px",
  fontFamily: "serif",
  lineHeight: "1.8",
  width: "normal",
};

const storageKey = "moonlit-library-reader-settings";

function pickAllowedValue<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fallback: T,
) {
  return typeof value === "string" && allowedValues.includes(value as T)
    ? (value as T)
    : fallback;
}

function normalizeSettings(value: unknown): ReaderSettings {
  if (!value || typeof value !== "object") {
    return defaultSettings;
  }

  const savedSettings = value as Partial<Record<keyof ReaderSettings, unknown>>;

  return {
    theme: pickAllowedValue(savedSettings.theme, themeOptions, defaultSettings.theme),
    fontSize: pickAllowedValue(
      savedSettings.fontSize,
      fontSizeOptions,
      defaultSettings.fontSize,
    ),
    fontFamily: pickAllowedValue(
      savedSettings.fontFamily,
      fontFamilyOptions,
      defaultSettings.fontFamily,
    ),
    lineHeight: pickAllowedValue(
      savedSettings.lineHeight,
      lineHeightOptions,
      defaultSettings.lineHeight,
    ),
    width: pickAllowedValue(savedSettings.width, widthOptions, defaultSettings.width),
  };
}

function applySettings(settings: ReaderSettings) {
  document.documentElement.dataset.readerTheme = settings.theme;
  document.documentElement.style.setProperty("--reader-font-size", settings.fontSize);
  document.documentElement.style.setProperty("--reader-line-height", settings.lineHeight);
  document.documentElement.style.setProperty(
    "--reader-font-family",
    settings.fontFamily === "serif"
      ? "Georgia, serif"
      : settings.fontFamily === "monospace"
        ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        : "Arial, Helvetica, sans-serif",
  );
  document.documentElement.style.setProperty(
    "--reader-width",
    settings.width === "narrow" ? "42rem" : settings.width === "wide" ? "64rem" : "52rem",
  );
}

export function ReaderSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);

  useEffect(() => {
    try {
      const storedSettings = window.localStorage.getItem(storageKey);
      const nextSettings = storedSettings
        ? normalizeSettings(JSON.parse(storedSettings) as unknown)
        : defaultSettings;

      setSettings(nextSettings);
      applySettings(nextSettings);
    } catch {
      applySettings(defaultSettings);
    }
  }, []);

  function updateSettings(nextSettings: ReaderSettings) {
    setSettings(nextSettings);
    applySettings(nextSettings);

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextSettings));
    } catch {
      // Reader settings are nice to have, but never required for reading.
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-full border border-current px-4 py-2 font-semibold opacity-85 transition hover:opacity-100"
      >
        Reader Settings
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-current/15 bg-[#0c141d] p-4 text-slate-100 shadow-2xl shadow-black/40">
          <div className="grid gap-4">
            <SettingSelect
              label="Background"
              value={settings.theme}
              options={[
                ["white", "White"],
                ["sepia", "Sepia"],
                ["dark", "Dark"],
                ["dark-blue", "Dark blue"],
              ]}
              onChange={(theme) => updateSettings({ ...settings, theme })}
            />
            <SettingSelect
              label="Font size"
              value={settings.fontSize}
              options={fontSizeOptions.map((size) => [size, size])}
              onChange={(fontSize) => updateSettings({ ...settings, fontSize })}
            />
            <SettingSelect
              label="Font family"
              value={settings.fontFamily}
              options={[
                ["serif", "Serif"],
                ["sans-serif", "Sans-serif"],
                ["monospace", "Monospace"],
              ]}
              onChange={(fontFamily) => updateSettings({ ...settings, fontFamily })}
            />
            <SettingSelect
              label="Line height"
              value={settings.lineHeight}
              options={lineHeightOptions.map((height) => [height, height])}
              onChange={(lineHeight) => updateSettings({ ...settings, lineHeight })}
            />
            <SettingSelect
              label="Reading width"
              value={settings.width}
              options={[
                ["narrow", "Narrow"],
                ["normal", "Normal"],
                ["wide", "Wide"],
              ]}
              onChange={(width) => updateSettings({ ...settings, width })}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

type SettingSelectProps<T extends string> = {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
};

function SettingSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: SettingSelectProps<T>) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-semibold text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="min-h-11 rounded-xl border border-white/10 bg-[#111c28] px-3 text-white outline-none focus:border-[#8eb7ff]/70"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
