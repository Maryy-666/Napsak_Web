"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";

export interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/images/hero-slide-1.jpg",
  className,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  if (error || !imgSrc) {
    return (
      <div
        className={`bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-medium text-xs ${className}`}
      >
        <ImageIcon className="w-5 h-5 opacity-60" />
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || "N'apsak Medya"}
      className={className}
      onError={() => {
        if (fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else {
          setError(true);
        }
      }}
    />
  );
}
