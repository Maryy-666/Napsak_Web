"use client";

import React from "react";
import { PushPin, WashiTape, PaperClip } from "./BoardStickers";

export type NoteVariant =
  | "square"
  | "rounded"
  | "h-rect"
  | "v-rect"
  | "grid"
  | "lined"
  | "torn"
  | "spiral"
  | "folded"
  | "stacked"
  | "paperclip"
  | "pushpin"
  | "washi-tape"
  | "polaroid";

export type NoteColor =
  | "sage"
  | "mint"
  | "cream"
  | "off-white"
  | "beige"
  | "peach"
  | "light-orange"
  | "lavender";

export interface PaperNoteProps {
  variant?: NoteVariant;
  color?: NoteColor;
  rotation?: number; // e.g. -1.5, 1.5
  width?: string | number;
  height?: string | number;
  pinColor?: "red" | "sage" | "peach" | "lavender" | "yellow" | "mint" | "coral";
  tapeColor?: "mint" | "peach" | "lavender" | "sage" | "yellow" | "grid";
  tapePattern?: "dots" | "stripes" | "solid";
  clipColor?: "gold" | "rose" | "silver";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
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

export const PaperNote: React.FC<PaperNoteProps> = ({
  variant = "square",
  color = "cream",
  rotation = 0,
  width = "250px",
  height = "250px",
  pinColor = "red",
  tapeColor = "mint",
  tapePattern = "stripes",
  clipColor = "gold",
  className = "",
  style = {},
  children,
}) => {
  const bg = colorBgMap[color] || colorBgMap.cream;
  const border = colorBorderMap[color] || colorBorderMap.cream;

  // Extremely subtle & backgrounded placeholder for empty slots
  const defaultPlaceholder = (
    <div className="w-full h-full border border-dashed border-stone-300/40 rounded-sm flex flex-col items-center justify-center p-3 text-center opacity-40">
      <span className="text-[14px] text-stone-400 font-light">+</span>
    </div>
  );

  const containerOpacityClass = children ? "opacity-100" : "opacity-45 hover:opacity-75 transition-opacity";

  return (
    <div
      className={`relative group transition-all duration-300 ease-out select-none ${containerOpacityClass} ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        width,
        height,
        ...style,
      }}
    >
      {/* ATTACHMENT ACCESSORIES (PIN / TAPE / CLIP) */}
      {(variant === "pushpin" || variant === "square" || variant === "stacked" || variant === "grid") && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 transition-transform group-hover:scale-110">
          <PushPin color={pinColor} />
        </div>
      )}

      {(variant === "washi-tape" || variant === "lined" || variant === "h-rect" || variant === "torn") && (
        <WashiTape
          color={tapeColor}
          pattern={tapePattern}
          rotation={-3}
          className="-top-3 left-6 scale-90"
        />
      )}

      {(variant === "paperclip" || variant === "v-rect" || variant === "spiral") && (
        <div className="absolute -top-3.5 right-6 z-30 transition-transform group-hover:-translate-y-1">
          <PaperClip color={clipColor} />
        </div>
      )}

      {/* NOTE PAPER BODY VARIANTS */}
      {variant === "stacked" ? (
        <div className="w-full h-full relative">
          <div
            className="absolute inset-0 rounded-lg border opacity-60 transform -rotate-3 translate-x-1 translate-y-1"
            style={{ backgroundColor: colorBgMap["peach"], borderColor: colorBorderMap["peach"] }}
          />
          <div
            className="absolute inset-0 rounded-lg border p-2.5 transition-all duration-300 shadow-xs"
            style={{ backgroundColor: bg, borderColor: border }}
          >
            {children || defaultPlaceholder}
          </div>
        </div>
      ) : variant === "polaroid" ? (
        <div className="w-full h-full bg-white p-2.5 pb-5 rounded-sm shadow-xs border border-stone-200/70 flex flex-col transition-all duration-300">
          <div
            className="w-full flex-1 rounded-sm border border-stone-200/60 relative overflow-hidden p-2"
            style={{ backgroundColor: bg }}
          >
            {children || defaultPlaceholder}
          </div>
        </div>
      ) : variant === "spiral" ? (
        <div
          className="w-full h-full rounded-r-lg shadow-xs border-y border-r p-2.5 pl-7 relative overflow-hidden transition-all duration-300"
          style={{ backgroundColor: bg, borderColor: border }}
        >
          <div className="absolute top-0 bottom-0 left-0 w-5 border-r border-dashed border-red-300/30 flex flex-col justify-around py-3 items-center bg-black/5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-stone-300/80 border border-stone-400/30" />
            ))}
          </div>
          {children || defaultPlaceholder}
        </div>
      ) : variant === "grid" ? (
        <div
          className="w-full h-full rounded-md shadow-xs border p-2.5 transition-all duration-300"
          style={{
            backgroundColor: bg,
            borderColor: border,
            backgroundImage:
              "linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        >
          {children || defaultPlaceholder}
        </div>
      ) : variant === "lined" ? (
        <div
          className="w-full h-full rounded-md shadow-xs border p-2.5 pl-7 relative overflow-hidden transition-all duration-300"
          style={{ backgroundColor: bg, borderColor: border }}
        >
          <div className="absolute top-0 bottom-0 left-5 w-[1px] bg-red-400/30" />
          {children || defaultPlaceholder}
        </div>
      ) : variant === "torn" ? (
        <div
          className="w-full h-full shadow-xs p-3 relative transition-all duration-300"
          style={{
            backgroundColor: bg,
            clipPath:
              "polygon(0% 0%, 100% 0%, 100% 92%, 97% 96%, 93% 91%, 88% 97%, 83% 92%, 78% 98%, 73% 93%, 68% 97%, 62% 91%, 57% 96%, 52% 92%, 46% 98%, 41% 93%, 36% 97%, 30% 92%, 25% 96%, 19% 91%, 14% 97%, 9% 92%, 4% 96%, 0% 90%)",
          }}
        >
          {children || defaultPlaceholder}
        </div>
      ) : variant === "folded" ? (
        <div
          className="w-full h-full rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow-xs border p-2.5 relative transition-all duration-300 overflow-hidden"
          style={{ backgroundColor: bg, borderColor: border }}
        >
          <div
            className="absolute bottom-0 right-0 w-6 h-6 bg-stone-300/40 shadow-xs border-t border-l border-black/10 z-10"
            style={{
              clipPath: "polygon(0 0, 0 100%, 100% 0)",
              backgroundColor: colorBorderMap[color],
            }}
          />
          {children || defaultPlaceholder}
        </div>
      ) : (
        <div
          className={`w-full h-full shadow-xs border p-2.5 transition-all duration-300 ${
            variant === "rounded" ? "rounded-2xl" : "rounded-md"
          }`}
          style={{ backgroundColor: bg, borderColor: border }}
        >
          {children || defaultPlaceholder}
        </div>
      )}
    </div>
  );
};
