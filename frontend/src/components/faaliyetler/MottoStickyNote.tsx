"use client";

import React from "react";
import { PushPin, WashiTape, PaperClip } from "./BoardStickers";
import { NoteColor } from "./PaperNote";

interface MottoStickyNoteProps {
  message: string;
  color?: NoteColor;
  rotation?: number;
  width?: string;
  height?: string;
  pinColor?: "red" | "sage" | "peach" | "lavender" | "yellow" | "mint" | "coral";
  tapeColor?: "mint" | "peach" | "lavender" | "sage" | "yellow";
  clipColor?: "gold" | "rose" | "silver";
  className?: string;
  style?: React.CSSProperties;
}

const colorBgMap: Record<NoteColor, string> = {
  sage: "#DCE7E1",
  mint: "#E0F2EC",
  cream: "#FFFDF7",
  "off-white": "#FAF8F5",
  beige: "#F4EFE6",
  peach: "#FFE8DB",
  "light-orange": "#FFF0E5",
  lavender: "#EAE6F8",
};

const colorBorderMap: Record<NoteColor, string> = {
  sage: "#C3D6CB",
  mint: "#C7E5DB",
  cream: "#F0EAD6",
  "off-white": "#EDE7DC",
  beige: "#E4DAAB",
  peach: "#F7D0BC",
  "light-orange": "#FAD8C3",
  lavender: "#D6CFF0",
};

export const MottoStickyNote: React.FC<MottoStickyNoteProps> = ({
  message,
  color = "sage",
  rotation = -2,
  width = "165px",
  height = "135px",
  pinColor,
  tapeColor,
  clipColor,
  className = "",
  style = {},
}) => {
  const bg = colorBgMap[color] || colorBgMap.sage;
  const border = colorBorderMap[color] || colorBorderMap.sage;

  return (
    <div
      className={`relative group transition-all duration-300 ease-out select-none ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        width,
        height,
        ...style,
      }}
    >
      {/* ACCESSORIES */}
      {pinColor && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 transition-transform group-hover:scale-110">
          <PushPin color={pinColor} />
        </div>
      )}

      {tapeColor && (
        <WashiTape
          color={tapeColor}
          pattern="stripes"
          rotation={-3}
          className="-top-3 left-4 scale-75"
        />
      )}

      {clipColor && (
        <div className="absolute -top-3.5 right-4 z-30 transition-transform group-hover:-translate-y-1">
          <PaperClip color={clipColor} />
        </div>
      )}

      {/* COMPACT MOTTO STICKY NOTE BODY */}
      <div
        className="w-full h-full rounded-xl shadow-xs border p-3 flex items-center justify-center text-center transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5"
        style={{ backgroundColor: bg, borderColor: border }}
      >
        <p className="font-handwriting text-sm sm:text-base text-stone-800 font-bold leading-snug tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
};
