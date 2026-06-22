"use client";

import { useEffect, useState } from "react";
import {
  READER_THEMES,
  ReaderThemeSelector,
  type ReaderThemeKey,
} from "@/components/ReaderThemeSelector";

type ReaderSettings = {
  theme: ReaderThemeKey;
  fontSize: (typeof fontSizeOptions)[number];
  fontFamily: (typeof fontFamilyOptions)[number];
  lineHeight: (typeof lineHeightOptions)[number];
  width: (typeof widthOptions)[number];
};

const fontSizeOptions = ["16px", "18px", "20px", "22px", "24px", "28px", "32px"] as const;
const fontFamilyOptions = ["serif", "sans-serif", "system"] as const;
const lineHeightOptions = ["1.5", "1.7", "1.9", "2.1"] as const;
const widthOptions = ["narrow", "normal", "wide"] as const;

const storageKey = "ghost-core-reader-settings";

const defaultSettings: ReaderSettings = {
  theme: "paper",
  fontSize: "20px",
  fontFamily: "serif",
  lineHeight: "1.7",
  width: "normal",
};

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
  const themeOptions = Object.keys(READER_THEMES) as ReaderThemeKey[];

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

function fontFamilyValue(fontFamily: ReaderSettings["fontFamily"]) {
  if (fontFamily === "serif") {
    return 'Georgia, "Times New Roman", serif';
  }

  if (fontFamily === "sans-serif") {
    return "Arial, Helvetica, sans-serif";
  }

  return '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
}

function widthValue(width: ReaderSettings["width"]) {
  if (width === "narrow") {
    return "42rem";
  }

  if (width === "wide") {
    return "68rem";
  }

  return "52rem";
}

function applySettings(settings: ReaderSettings) {
  const theme = READER_THEMES[settings.theme];
  const root = document.documentElement;

  root.style.setProperty("--reader-background", theme.background);
  root.style.setProperty("--reader-text", theme.text);
  root.style.setProperty("--reader-font-size", settings.fontSize);
  root.style.setProperty("--reader-line-height", settings.lineHeight);
  root.style.setProperty("--reader-font-family", fontFamilyValue(settings.fontFamily));
  root.style.setProperty("--reader-width", widthValue(settings.width));
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
      // Reader preferences should never block reading.
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-4 text-sm font-black text-stone-900 shadow-sm shadow-stone-950/5 transition hover:border-orange-200 hover:bg-orange-50"
      >
        Reader Settings
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[min(26rem,calc(100vw-2rem))] rounded-3xl border border-orange-100 bg-white p-4 text-stone-900 shadow-2xl shadow-orange-950/18">
          <div className="grid gap-5">
            <ReaderThemeSelector
              value={settings.theme}
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
                ["system", "System"],
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
      <span className="font-black text-stone-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="min-h-11 rounded-2xl border border-stone-200 bg-white px-3 font-semibold text-stone-900 outline-none transition focus:border-[#f06a2a] focus:ring-4 focus:ring-orange-100"
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
