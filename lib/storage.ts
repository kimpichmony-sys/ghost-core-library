import type { ReadingProgress } from "@/lib/types";

const progressPrefix = "moonlit-library-progress:";

function isReadingProgress(value: unknown): value is ReadingProgress {
  if (!value || typeof value !== "object") {
    return false;
  }

  const progress = value as Partial<ReadingProgress>;

  return (
    typeof progress.seriesSlug === "string" &&
    typeof progress.bookSlug === "string" &&
    typeof progress.chapterSlug === "string" &&
    typeof progress.chapterNumber === "number" &&
    typeof progress.chapterTitle === "string" &&
    typeof progress.timestamp === "number"
  );
}

export function getStoredProgress(seriesSlug: string): ReadingProgress | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawProgress = window.localStorage.getItem(`${progressPrefix}${seriesSlug}`);
    const progress = rawProgress ? (JSON.parse(rawProgress) as unknown) : null;
    return isReadingProgress(progress) ? progress : null;
  } catch {
    return null;
  }
}

export function saveStoredProgress(progress: ReadingProgress) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      `${progressPrefix}${progress.seriesSlug}`,
      JSON.stringify(progress),
    );
  } catch {
    // Private browsing modes can block localStorage. Reading should still work.
  }
}
