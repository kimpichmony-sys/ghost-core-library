"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredProgress } from "@/lib/storage";
import type { ReadingProgress } from "@/lib/types";

type ContinueReadingButtonProps = {
  seriesSlug: string;
};

export function ContinueReadingButton({ seriesSlug }: ContinueReadingButtonProps) {
  const [progress, setProgress] = useState<ReadingProgress | null>(null);

  useEffect(() => {
    setProgress(getStoredProgress(seriesSlug));
  }, [seriesSlug]);

  if (!progress) {
    return null;
  }

  return (
    <Link
      href={`/series/${seriesSlug}/${progress.bookSlug}/chapter/${progress.chapterSlug}`}
      className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-orange-200 bg-white px-5 font-black text-[#df3f21] shadow-sm shadow-orange-950/5 transition hover:border-[#f06a2a] hover:bg-orange-50"
    >
      Continue: Chapter {progress.chapterNumber}
    </Link>
  );
}
