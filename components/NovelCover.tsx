"use client";

import Image from "next/image";
import { useState } from "react";

type NovelCoverProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function NovelCover({
  src,
  alt,
  priority = false,
  sizes = "320px",
  className = "",
}: NovelCoverProps) {
  const [imageSrc, setImageSrc] = useState(src || "/covers/placeholder.svg");

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      onError={() => setImageSrc("/covers/placeholder.svg")}
    />
  );
}
