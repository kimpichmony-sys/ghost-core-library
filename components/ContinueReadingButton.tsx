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
      className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#8eb7ff]/35 bg-[#8eb7ff]/10 px-5 font-semibold text-[#c9dcff] transition hover:bg-[#8eb7ff]/16"
    >
      Continue: Chapter {progress.chapterNumber}
    </Link>
  );
}
