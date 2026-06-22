"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ReadAloudControlsProps = {
  text: string;
};

type ReadAloudStatus = "Not started" | "Reading" | "Paused" | "Finished";

type ReadAloudSettings = {
  voiceURI: string;
  rate: number;
  volume: number;
};

const storageKey = "ghost-core-read-aloud-settings";
const speedOptions = [0.75, 1, 1.25, 1.5, 2] as const;
const defaultSettings: ReadAloudSettings = {
  voiceURI: "",
  rate: 1,
  volume: 1,
};

function cleanMarkdownForSpeech(markdown: string) {
  return markdown
    .replace(/^---[\s\S]*?---\s*/u, "")
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, "$1")
    .replace(/^#{1,6}\s+/gmu, "")
    .replace(/^>\s?/gmu, "")
    .replace(/[*_~#>|-]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function chunkText(text: string, maxLength = 1600) {
  const chunks: string[] = [];
  let remainingText = text.trim();

  while (remainingText.length > maxLength) {
    const slice = remainingText.slice(0, maxLength);
    const breakPoint = Math.max(
      slice.lastIndexOf(". "),
      slice.lastIndexOf("! "),
      slice.lastIndexOf("? "),
      slice.lastIndexOf("; "),
      slice.lastIndexOf(", "),
      slice.lastIndexOf(" "),
    );
    const endIndex = breakPoint > 300 ? breakPoint + 1 : maxLength;

    chunks.push(remainingText.slice(0, endIndex).trim());
    remainingText = remainingText.slice(endIndex).trim();
  }

  if (remainingText) {
    chunks.push(remainingText);
  }

  return chunks;
}

function isSpeechSupported() {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
}

function normalizeSettings(value: unknown): ReadAloudSettings {
  if (!value || typeof value !== "object") {
    return defaultSettings;
  }

  const savedSettings = value as Partial<ReadAloudSettings>;
  const rate = speedOptions.includes(savedSettings.rate as (typeof speedOptions)[number])
    ? Number(savedSettings.rate)
    : defaultSettings.rate;
  const volume =
    typeof savedSettings.volume === "number" &&
    savedSettings.volume >= 0 &&
    savedSettings.volume <= 1
      ? savedSettings.volume
      : defaultSettings.volume;

  return {
    voiceURI: typeof savedSettings.voiceURI === "string" ? savedSettings.voiceURI : "",
    rate,
    volume,
  };
}

export function ReadAloudControls({ text }: ReadAloudControlsProps) {
  const cleanText = useMemo(() => cleanMarkdownForSpeech(text), [text]);
  const chunks = useMemo(() => chunkText(cleanText), [cleanText]);
  const chunkIndexRef = useRef(0);
  const shouldContinueRef = useRef(false);
  const [isSupported, setIsSupported] = useState(true);
  const [status, setStatus] = useState<ReadAloudStatus>("Not started");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<ReadAloudSettings>(defaultSettings);

  useEffect(() => {
    if (!isSpeechSupported()) {
      setIsSupported(false);
      return;
    }

    const synth = window.speechSynthesis;

    function loadVoices() {
      setVoices(synth.getVoices());
    }

    try {
      const storedSettings = window.localStorage.getItem(storageKey);
      setSettings(
        storedSettings
          ? normalizeSettings(JSON.parse(storedSettings) as unknown)
          : defaultSettings,
      );
    } catch {
      setSettings(defaultSettings);
    }

    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);

    return () => {
      shouldContinueRef.current = false;
      synth.cancel();
      synth.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch {
      // Read aloud settings are optional. The reader should never crash here.
    }
  }, [settings]);

  function getSelectedVoice() {
    return voices.find((voice) => voice.voiceURI === settings.voiceURI) ?? null;
  }

  function speakChunk(index: number) {
    if (!isSpeechSupported() || !chunks[index]) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    const selectedVoice = getSelectedVoice();

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = settings.rate;
    utterance.volume = settings.volume;

    utterance.onend = () => {
      if (!shouldContinueRef.current) {
        return;
      }

      const nextIndex = index + 1;

      if (nextIndex < chunks.length) {
        chunkIndexRef.current = nextIndex;
        speakChunk(nextIndex);
      } else {
        shouldContinueRef.current = false;
        chunkIndexRef.current = 0;
        setStatus("Finished");
      }
    };

    utterance.onerror = () => {
      shouldContinueRef.current = false;
      setStatus("Finished");
    };

    window.speechSynthesis.speak(utterance);
  }

  function startReading() {
    if (!isSpeechSupported() || !cleanText) {
      return;
    }

    window.speechSynthesis.cancel();
    chunkIndexRef.current = 0;
    shouldContinueRef.current = true;
    setStatus("Reading");
    speakChunk(0);
  }

  function pauseReading() {
    if (!isSpeechSupported() || !window.speechSynthesis.speaking) {
      return;
    }

    window.speechSynthesis.pause();
    setStatus("Paused");
  }

  function resumeReading() {
    if (!isSpeechSupported()) {
      return;
    }

    window.speechSynthesis.resume();
    shouldContinueRef.current = true;
    setStatus("Reading");
  }

  function stopReading() {
    if (!isSpeechSupported()) {
      return;
    }

    shouldContinueRef.current = false;
    chunkIndexRef.current = 0;
    window.speechSynthesis.cancel();
    setStatus("Not started");
  }

  function updateSettings(nextSettings: ReadAloudSettings) {
    setSettings(nextSettings);

    if (status === "Reading" && isSpeechSupported()) {
      window.speechSynthesis.cancel();
      shouldContinueRef.current = true;
      speakChunk(chunkIndexRef.current);
    }
  }

  if (!isSupported) {
    return (
      <section className="mx-auto w-full max-w-[var(--reader-width)] rounded-2xl border border-current/10 p-5 text-sm opacity-80">
        Read aloud is not supported in this browser.
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[var(--reader-width)] rounded-2xl border border-current/10 p-4 shadow-xl shadow-black/10 sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Read Aloud</h2>
            <p className="text-sm opacity-70">Status: {status}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <ControlButton onClick={startReading}>Play</ControlButton>
            <ControlButton onClick={pauseReading}>Pause</ControlButton>
            <ControlButton onClick={resumeReading}>Resume</ControlButton>
            <ControlButton onClick={stopReading}>Stop</ControlButton>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-2 text-sm">
            <span className="font-semibold opacity-80">Speed</span>
            <select
              value={settings.rate}
              onChange={(event) =>
                updateSettings({ ...settings, rate: Number(event.target.value) })
              }
              className="min-h-11 rounded-xl border border-current/15 bg-transparent px-3 outline-none"
            >
              {speedOptions.map((speed) => (
                <option key={speed} value={speed}>
                  {speed}x
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold opacity-80">Voice</span>
            <select
              value={settings.voiceURI}
              onChange={(event) =>
                updateSettings({ ...settings, voiceURI: event.target.value })
              }
              className="min-h-11 rounded-xl border border-current/15 bg-transparent px-3 outline-none"
            >
              <option value="">Default voice</option>
              {voices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} {voice.lang ? `(${voice.lang})` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-semibold opacity-80">
              Volume {Math.round(settings.volume * 100)}%
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(event) =>
                updateSettings({ ...settings, volume: Number(event.target.value) })
              }
              className="h-11 w-full accent-[#e7c873]"
            />
          </label>
        </div>

        {voices.length === 0 ? (
          <p className="text-sm opacity-65">Loading browser voices...</p>
        ) : null}
      </div>
    </section>
  );
}

function ControlButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 rounded-xl border border-current/15 px-4 text-sm font-semibold transition hover:bg-current/10"
    >
      {children}
    </button>
  );
}
