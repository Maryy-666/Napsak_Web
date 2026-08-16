"use client";

import React from "react";

// ==========================================
// 1. PUSHPIN (RAPTİYE) COMPONENT
// ==========================================
interface PushPinProps {
  color?: "red" | "sage" | "peach" | "lavender" | "yellow" | "mint" | "coral";
  className?: string;
}

export const PushPin: React.FC<PushPinProps> = ({ color = "red", className = "" }) => {
  const colorMap = {
    red: { fill: "#E56B6F", highlight: "#F7A3A5", shadow: "#B53A3E" },
    sage: { fill: "#7E9F8E", highlight: "#A7C4B5", shadow: "#537363" },
    peach: { fill: "#E29578", highlight: "#FFDDD2", shadow: "#B2684C" },
    lavender: { fill: "#9D8189", highlight: "#D8E2DC", shadow: "#6B4F57" },
    yellow: { fill: "#E9C46A", highlight: "#F4A261", shadow: "#B88A22" },
    mint: { fill: "#6A9E93", highlight: "#A8DADC", shadow: "#45756C" },
    coral: { fill: "#F4A261", highlight: "#E76F51", shadow: "#C8553D" },
  };

  const palette = colorMap[color] || colorMap.red;

  return (
    <div className={`relative inline-block filter drop-shadow-md z-30 select-none ${className}`}>
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pushpin pin tip / shadow */}
        <ellipse cx="12" cy="24" rx="3" ry="1.5" fill="rgba(0,0,0,0.25)" />
        <path d="M12 14L12 24" stroke="#718096" strokeWidth="2" strokeLinecap="round" />
        
        {/* Pushpin head base shadow */}
        <path d="M6 14C6 12 18 12 18 14L16 16H8L6 14Z" fill={palette.shadow} />
        
        {/* Pushpin main body knob */}
        <circle cx="12" cy="9" r="6" fill={palette.fill} />
        <ellipse cx="10" cy="7" rx="2" ry="1.5" fill={palette.highlight} opacity="0.8" />
        
        {/* Top pin head ring */}
        <ellipse cx="12" cy="4" rx="4" ry="2" fill={palette.highlight} />
      </svg>
    </div>
  );
};

// ==========================================
// 2. WASHI TAPE STRIP COMPONENT
// ==========================================
interface WashiTapeProps {
  color?: "mint" | "peach" | "lavender" | "sage" | "yellow" | "grid";
  pattern?: "dots" | "stripes" | "solid";
  rotation?: number;
  className?: string;
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  color = "mint",
  pattern = "stripes",
  rotation = 0,
  className = "",
}) => {
  const bgColors = {
    mint: "#C5E8DC",
    peach: "#FCD5CE",
    lavender: "#E2ECE9",
    sage: "#D8E2DC",
    yellow: "#FAE1DD",
    grid: "#FFE5D9",
  };

  return (
    <div
      className={`absolute z-20 opacity-90 backdrop-blur-[1px] select-none ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div
        className="w-24 h-6 shadow-sm border-x border-dashed border-black/10 relative overflow-hidden"
        style={{
          backgroundColor: bgColors[color] || bgColors.mint,
          clipPath:
            "polygon(0% 10%, 3% 0%, 97% 0%, 100% 12%, 98% 88%, 100% 100%, 0% 100%, 2% 90%)",
        }}
      >
        {/* Subtle tape texture / stripes */}
        {pattern === "stripes" && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 0, transparent 8px)",
            }}
          />
        )}
        {pattern === "dots" && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "6px 6px",
            }}
          />
        )}
        {/* Washi tape translucency shine */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </div>
  );
};

// ==========================================
// 3. PAPERCLIP COMPONENT
// ==========================================
export const PaperClip: React.FC<{ className?: string; color?: "silver" | "gold" | "rose" }> = ({
  className = "",
  color = "gold",
}) => {
  const strokeColor = color === "gold" ? "#D4AF37" : color === "rose" ? "#E0A96D" : "#8A9BA8";

  return (
    <div className={`relative inline-block z-30 filter drop-shadow select-none ${className}`}>
      <svg width="22" height="42" viewBox="0 0 22 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7 11V31C7 33.7614 9.23858 36 12 36C14.7614 36 17 33.7614 17 31V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V28C7 29.1046 7.89543 30 9 30C10.1046 30 11 29.1046 11 28V12"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// ==========================================
// 4. DECORATIVE YOUTH & COMMUNITY STICKERS
// ==========================================

// Headphone Sticker
export const StickerHeadphones: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`sticker-wrapper p-1 transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-stone-200/80 transform rotate-[-4deg]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#EAE6F8" />
        <path d="M12 26C12 18.268 17.3726 12 24 12C30.6274 12 36 18.268 36 26" stroke="#6B5B95" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="10" y="24" width="8" height="14" rx="4" fill="#6B5B95" />
        <rect x="30" y="24" width="8" height="14" rx="4" fill="#6B5B95" />
        <circle cx="14" cy="31" r="2" fill="#EAE6F8" />
        <circle cx="34" cy="31" r="2" fill="#EAE6F8" />
      </svg>
    </div>
  </div>
);

// Camera Sticker
export const StickerCamera: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`sticker-wrapper p-1 transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-stone-200/80 transform rotate-[6deg]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#FFE8DB" />
        <path d="M16 16H20L22 13H26L28 16H32V18H16V16Z" fill="#D98A6C" />
        <rect x="11" y="18" width="26" height="18" rx="5" fill="#E07A5F" />
        <circle cx="24" cy="27" r="6" fill="#FFFDF7" stroke="#3D405B" strokeWidth="2.5" />
        <circle cx="24" cy="27" r="2.5" fill="#3D405B" />
        <circle cx="32" cy="22" r="1.5" fill="#F4F1DE" />
      </svg>
    </div>
  </div>
);

// Coffee Mug Sticker
export const StickerCoffeeMug: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`sticker-wrapper p-1 transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-stone-200/80 transform rotate-[-3deg]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#F4EFE6" />
        {/* Steam */}
        <path d="M20 12C20 10 22 10 22 8" stroke="#D4A373" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 13C26 11 28 11 28 9" stroke="#D4A373" strokeWidth="2" strokeLinecap="round" />
        {/* Mug */}
        <path d="M16 17H30V28C30 31.3137 27.3137 34 24 34H22C18.6863 34 16 31.3137 16 28V17Z" fill="#81B29A" />
        <path d="M30 20H33C34.6569 20 36 21.3431 36 23V25C36 26.6569 34.6569 28 33 28H30" stroke="#81B29A" strokeWidth="3" />
        {/* Heart icon on mug */}
        <path d="M23 23C22 21 19.5 21.5 20.5 24C21.5 26.5 23 27 23 27C23 27 24.5 26.5 25.5 24C26.5 21.5 24 21 23 23Z" fill="#FFFDF7" />
      </svg>
    </div>
  </div>
);

// Plant / Sprout Sticker
export const StickerPlant: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`sticker-wrapper p-1 transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-stone-200/80 transform rotate-[5deg]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#E0F2EC" />
        {/* Pot */}
        <path d="M17 26L19 36H29L31 26H17Z" fill="#E07A5F" />
        <rect x="15" y="23" width="18" height="4" rx="2" fill="#F4A261" />
        {/* Leaves */}
        <path d="M24 23V14C24 14 18 13 18 18C18 21 22 22 24 23Z" fill="#2A9D8F" />
        <path d="M24 23V12C24 12 30 11 30 16C30 19 26 21 24 23Z" fill="#52B788" />
      </svg>
    </div>
  </div>
);

// Lightbulb Sticker
export const StickerLightbulb: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`sticker-wrapper p-1 transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-stone-200/80 transform rotate-[-6deg]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#FFF0E5" />
        {/* Bulb */}
        <path d="M24 11C18.4772 11 14 15.4772 14 21C14 24.5 15.8 27.5 18.5 29.2L19.5 33H28.5L29.5 29.2C32.2 27.5 34 24.5 34 21C34 15.4772 29.5228 11 24 11Z" fill="#E9C46A" />
        <path d="M20 33H28V36H20V33Z" fill="#9A8C98" />
        <path d="M22 36H26V38H22V36Z" fill="#4A4E69" />
        {/* Glow Sparkles */}
        <path d="M24 6V8" stroke="#F4A261" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 20H12" stroke="#F4A261" strokeWidth="2" strokeLinecap="round" />
        <path d="M36 20H38" stroke="#F4A261" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

// Tote Bag / Notebook Sticker
export const StickerNotebook: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`sticker-wrapper p-1 transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-stone-200/80 transform rotate-[4deg]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#DCE7E1" />
        {/* Book */}
        <rect x="14" y="12" width="20" height="26" rx="3" fill="#457B9D" />
        <path d="M14 12H18V38H14V12Z" fill="#1D3557" />
        {/* Bookmark */}
        <path d="M26 12V22L29 19L32 22V12H26Z" fill="#E63946" />
      </svg>
    </div>
  </div>
);

// Speech Bubble with Heart Sticker
export const StickerHeartBubble: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`sticker-wrapper p-1 transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-stone-200/80 transform rotate-[-5deg]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#FFE8DB" />
        <path d="M12 23C12 16.9249 16.9249 12 23 12H25C31.0751 12 36 16.9249 36 23C36 29.0751 31.0751 34 25 34H18L13 37V31.5C12.3789 29.006 12 26.1557 12 23Z" fill="#F4A261" />
        <path d="M24 20C22.5 18 19.5 19 20.5 22.5C21.5 26 24 27.5 24 27.5C24 27.5 26.5 26 27.5 22.5C28.5 19 25.5 18 24 20Z" fill="#FFFDF7" />
      </svg>
    </div>
  </div>
);

// High-Five / Community Hands Sticker
export const StickerHighFive: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`sticker-wrapper p-1 transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-stone-200/80 transform rotate-[3deg]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#EAE6F8" />
        {/* Left hand */}
        <path d="M13 28L21 21C22 20 23.5 20.5 24 22L20 29" stroke="#7A5C96" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#D8BBFF" />
        {/* Right hand */}
        <path d="M35 28L27 21C26 20 24.5 20.5 24 22L28 29" stroke="#7A5C96" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#F0C600" />
        {/* Sparkles */}
        <circle cx="24" cy="16" r="2" fill="#E63946" />
        <path d="M24 10V12" stroke="#E63946" strokeWidth="2" />
      </svg>
    </div>
  </div>
);

// Megaphone & Music Notes Sticker
export const StickerMegaphone: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`sticker-wrapper p-1 transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-stone-200/80 transform rotate-[-4deg]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#E0F2EC" />
        <path d="M14 22V28H18L26 34V16L18 22H14Z" fill="#2A9D8F" />
        <path d="M18 28L20 36H23L21 28" fill="#264653" />
        <path d="M29 20C31 22 31 26 29 28" stroke="#E76F51" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M33 17C37 21 37 27 33 31" stroke="#E76F51" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

// Envelope Sticker
export const StickerEnvelope: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`sticker-wrapper p-1 transition-transform hover:scale-105 duration-300 ${className}`}>
    <div className="bg-white p-2 rounded-2xl shadow-lg border border-stone-200/80 transform rotate-[5deg]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#F4EFE6" />
        <rect x="11" y="16" width="26" height="18" rx="3" fill="#FFE8DB" stroke="#D4A373" strokeWidth="2" />
        <path d="M11 18L24 27L37 18" stroke="#D4A373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="25" r="3" fill="#E07A5F" />
      </svg>
    </div>
  </div>
);

// Doodles: Star & Hearts Floating Elements
export const DoodleStars: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`pointer-events-none select-none opacity-80 ${className}`}>
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <path d="M15 10L17 15L22 17L17 19L15 24L13 19L8 17L13 15L15 10Z" fill="#F4A261" />
      <path d="M42 32L43.5 36L48 37.5L43.5 39L42 43L40.5 39L36 37.5L40.5 36L42 32Z" fill="#2A9D8F" />
      <circle cx="48" cy="14" r="3" fill="#E76F51" />
      <circle cx="12" cy="46" r="2.5" fill="#E9C46A" />
      <path d="M28 42C27 40.5 24.5 41 25.5 43.5C26.5 46 28 47 28 47C28 47 29.5 46 30.5 43.5C31.5 41 29 40.5 28 42Z" fill="#E07A5F" />
    </svg>
  </div>
);
