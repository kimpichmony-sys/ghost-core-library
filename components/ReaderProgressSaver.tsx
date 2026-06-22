"use client";

import { useEffect } from "react";
import { saveStoredProgress } from "@/lib/storage";

type ReaderProgressSaverProps = {
  seriesSlug: string;
  bookSlug: string;
  chapterSlug: string;
  chapterNumber: number;
  chapterTitle: string;
};

export function ReaderProgressSaver({
  seriesSlug,
  bookSlug,
  chapterSlug,
  chapterNumber,
  chapterTitle,
}: ReaderProgressSaverProps) {
  useEffect(() => {
    saveStoredProgress({
      seriesSlug,
      bookSlug,
      chapterSlug,
      chapterNumber,
      chapterTitle,
      timestamp: Date.now(),
    });
  }, [bookSlug, chapterNumber, chapterSlug, chapterTitle, seriesSlug]);

  return null;
}
