"use client";

import React from "react";
import Image from "next/image";
import { FaaliyetItem } from "./types";
import { PushPin, WashiTape, PaperClip } from "./BoardStickers";
import { Calendar, Sparkles } from "lucide-react";

interface ActivityNoteCardProps {
  item: FaaliyetItem;
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const ActivityNoteCard: React.FC<ActivityNoteCardProps> = ({
  item,
  width = "250px",
  height = "250px",
  className = "",
  style = {},
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative group transition-all duration-300 ease-out select-none cursor-pointer ${className}`}
      style={{
        transform: `rotate(${item.rotation}deg)`,
        width,
        height,
        ...style,
      }}
    >
      {/* ATTACHMENT ACCESSORY (EITHER PIN OR TAPE - NEVER BOTH AT THE SAME TIME) */}
      {item.pinColor ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 transition-transform group-hover:scale-110">
          <PushPin color={item.pinColor} />
        </div>
      ) : item.tapeColor ? (
        <WashiTape
          color={item.tapeColor}
          pattern={item.tapePattern || "stripes"}
          rotation={-2}
          className="-top-3 left-6 scale-85"
        />
      ) : item.clipColor ? (
        <div className="absolute -top-3.5 right-6 z-30 transition-transform group-hover:-translate-y-1">
          <PaperClip color={item.clipColor} />
        </div>
      ) : null}

      {/* MINIMALIST POLAROID MEMORY PHOTO PRINT FRAME */}
      <div className="w-full h-full bg-[#FFFDF9] p-2.5 pb-2.5 rounded-xl shadow-xs border border-stone-200/60 flex flex-col justify-between transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
        {/* 1. HERO PHOTO WINDOW (70% Height) */}
        <div className="relative w-full h-[168px] rounded-lg overflow-hidden border border-stone-200/70 bg-stone-100 shadow-2xs">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#E0F2EC]/30">
              <Sparkles className="w-5 h-5 text-[#2A9D8F]/50" />
            </div>
          )}
        </div>

        {/* 2. BOTTOM MINIMALIST CONTENT (Standard Site Fonts) */}
        <div className="pt-1.5 px-0.5 flex flex-col justify-between flex-1">
          {/* Title (font-headings) */}
          <h3 className="text-xs font-bold text-stone-900 font-headings line-clamp-1 group-hover:text-[#07452C] transition-colors leading-tight">
            {item.title}
          </h3>

          {/* Single Short Memory Sentence (font-sans) */}
          <p className="font-sans text-[11px] font-medium text-stone-600 line-clamp-1 my-0.5 leading-snug">
            {item.memoryCaption || item.description}
          </p>

          {/* Soft Date (font-sans) */}
          <div className="pt-0.5 border-t border-dashed border-stone-200/60 flex items-center justify-between text-[9.5px] text-stone-500 font-sans">
            <div className="flex items-center gap-1 font-medium text-stone-500">
              <Calendar className="w-3 h-3 text-[#07452C]" />
              <span className="font-sans text-[10px] text-stone-600 font-semibold">
                {item.date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
