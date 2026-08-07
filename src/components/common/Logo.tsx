"use client";

import React from "react";
import Image from "next/image";
import logoImg from "../../assets/logos/napsakgenlik_logo.jpg";
import logoMarkGreen from "../../assets/logos/napsak_mark_green.png";
import logoMarkWhite from "../../assets/logos/napsak_mark_white.png";

// Simple utility function to merge classes
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface LogoProps {
  // "default": full badge (green square) — used for normal, foreground branding.
  // "decorative": transparent brand-green icon only — used for background watermarks (no jpg background box).
  // "decorative-white": transparent white icon only — used for background watermarks on dark surfaces.
  variant?: "default" | "decorative" | "decorative-white";
  size?: number | { width: number; height: number };
  className?: string;
  priority?: boolean;
  opacity?: number; // Value between 0 and 1 (e.g. 0.03 for 3%) or 0 and 100 (e.g. 3 for 3%)
  rotation?: number; // Rotation angle in degrees (e.g., -12)
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "default",
  size = 120,
  className,
  priority = false,
  opacity,
  rotation,
  alt,
}) => {
  const isDecorative = variant === "decorative" || variant === "decorative-white";

  const activeSrc =
    variant === "decorative"
      ? logoMarkGreen
      : variant === "decorative-white"
      ? logoMarkWhite
      : logoImg;

  // Calculate dimensions keeping aspect ratio intact
  const imageWidth = typeof size === "number" ? size : size.width;
  const imageHeight =
    typeof size === "number"
      ? Math.round((size / activeSrc.width) * activeSrc.height)
      : size.height;

  // Process opacity value (accepts both 0-1 and 0-100 scales)
  const resolvedOpacity =
    opacity !== undefined
      ? opacity > 1
        ? opacity / 100
        : opacity
      : isDecorative
      ? 0.05
      : 1;

  // Compile inline styles for purely dynamic transform and opacity values
  const dynamicStyles: React.CSSProperties = {
    opacity: resolvedOpacity,
    transform: rotation ? `rotate(${rotation}deg)` : undefined,
  };

  const baseClasses = cn(
    "transition-all duration-300 ease-in-out block select-none",
    isDecorative
      ? "pointer-events-none select-none z-0"
      : "pointer-events-auto select-all",
    className
  );

  return (
    <div
      className={baseClasses}
      style={dynamicStyles}
      aria-hidden={isDecorative ? "true" : undefined}
    >
      <Image
        src={activeSrc}
        width={imageWidth}
        height={imageHeight}
        alt={isDecorative ? "" : alt || "N'apsak? Gençlik Topluluğu"}
        priority={priority}
        className="h-auto object-contain"
        draggable={!isDecorative}
      />
    </div>
  );
};

Logo.displayName = "Logo";
export default Logo;
