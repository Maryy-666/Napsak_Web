"use client";

import React, { useState, useEffect } from "react";
import { FaaliyetItem, BoardSlot, FaaliyetKategori } from "./types";
import { ActivityNoteCard } from "./ActivityNoteCard";
import { ActivityDetailModal } from "./ActivityDetailModal";
import {
  FaaliyetItem as AdminFaaliyetItem,
  FaaliyetlerRepository,
  subscribeFaaliyetlerChanges,
} from "../../lib/faaliyetlerStore";
import {
  StickerHeadphones,
  StickerCamera,
  StickerPlant,
  StickerLightbulb,
} from "./BoardStickers";

export const VisionBoard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [adminItems, setAdminItems] = useState<AdminFaaliyetItem[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<FaaliyetItem | null>(null);

  // Subscribe to Admin Panel Faaliyetler Store changes (localStorage sync)
  useEffect(() => {
    const loadData = () => {
      const all = FaaliyetlerRepository.getAllFaaliyetler();
      setAdminItems(all);
    };

    loadData();
    const unsubscribe = subscribeFaaliyetlerChanges(() => {
      loadData();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Map Admin Faaliyet items to Vision Board Polaroid Activity Card format
  const mappedActivities: FaaliyetItem[] = adminItems.map((adminItem, index) => {
    let cat: FaaliyetKategori = "atolye";
    const catLower = (adminItem.category || "").toLowerCase();
    if (
      catLower.includes("sosyal") ||
      catLower.includes("toplum") ||
      catLower.includes("çevre")
    ) {
      cat = "sosyal";
    } else if (
      catLower.includes("tekno") ||
      catLower.includes("yazılım") ||
      catLower.includes("kampüs") ||
      catLower.includes("kariyer")
    ) {
      cat = "teknoloji";
    }

    const defaultPins: Array<
      "red" | "sage" | "peach" | "lavender" | "yellow" | "mint" | "coral"
    > = ["coral", "sage", "yellow", "mint", "peach", "lavender"];
    const defaultTapes: Array<"mint" | "peach" | "lavender" | "sage" | "yellow"> = [
      "peach",
      "mint",
      "yellow",
      "lavender",
      "sage",
    ];

    // Alternate attachment: Even cards get Pin, Odd cards get Tape (Never both!)
    const isPin = index % 2 === 0;

    return {
      id: adminItem.id,
      title: adminItem.title,
      description: adminItem.summary,
      memoryCaption: adminItem.summary,
      category: cat,
      categoryLabel: adminItem.category || "Topluluk",
      date: adminItem.date || "2025",
      iconName:
        cat === "teknoloji"
          ? "briefcase"
          : cat === "sosyal"
          ? "heart"
          : "palette",
      imageUrl: adminItem.image || undefined,
      noteVariant: "square",
      noteColor: "off-white",
      rotation: index % 2 === 0 ? -1.2 : 1.2,
      pinColor: isPin ? defaultPins[index % defaultPins.length] : undefined,
      tapeColor: !isPin ? defaultTapes[index % defaultTapes.length] : undefined,
    };
  });

  // Filter activities based on active filter button
  const filteredActivities = mappedActivities.filter((act) => {
    if (activeFilter === "all") return true;
    return act.category === activeFilter;
  });

  // DYNAMIC BOARD HEIGHT CALCULATION BASED ONLY ON ACTIVE ACTIVITIES:
  const activeCount = filteredActivities.length;
  const totalRows = Math.max(1, Math.ceil(activeCount / 3));
  const desktopCanvasHeight = totalRows * 285 + 40;

  // Render ONLY active activity slots with generous margins
  const colLefts = ["80px", "490px", "890px"];
  const boardSlots: BoardSlot[] = filteredActivities.map((act, idx) => {
    const row = Math.floor(idx / 3);
    const col = idx % 3;
    return {
      slotId: `slot-${act.id}`,
      top: `${row * 285 + 45}px`,
      left: colLefts[col],
      width: "250px",
      height: "250px",
      rotation: idx % 2 === 0 ? -1.2 : 1.2,
      activityData: act,
      placeholderVariant: "square",
      placeholderColor: "cream",
      zIndex: 10 + idx,
    };
  });

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
      {/* COMPACT & MODERN TOP TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white/80 backdrop-blur-md p-3 px-5 rounded-2xl border border-stone-200/80 shadow-xs">
        {/* Left Side Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#07452C]" />
          <h2 className="text-sm sm:text-base font-bold text-stone-800 font-headings">
            Faaliyet & Anı Panosu
          </h2>
        </div>

        {/* Right Side Filter Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {[
            { id: "all", label: "Tüm Panolar" },
            { id: "atolye", label: "Atölye & Tasarım" },
            { id: "teknoloji", label: "Yazılım & Kampüs" },
            { id: "sosyal", label: "Sosyal Etki" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all duration-200 ${
                activeFilter === btn.id
                  ? "bg-[#07452C] text-white shadow-xs"
                  : "bg-white/90 text-stone-600 hover:bg-stone-100 border border-stone-200/80"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* MINIMALIST VISION BOARD CONTAINER */}
      <div
        className="relative w-full rounded-[2rem] border border-[#07452C]/12 shadow-[0_12px_40px_-15px_rgba(7,69,44,0.08)] overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          backgroundColor: "#FDFBF7",
          backgroundImage: `radial-gradient(rgba(7,69,44,0.06) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          backgroundPosition: "0 0",
        }}
      >
        {/* Soft Ambient Inner Vignette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(7,69,44,0.03)] z-20" />

        {/* DESKTOP CANVAS */}
        <div
          className="hidden lg:block relative w-full transition-all duration-500 select-none"
          style={{ height: `${desktopCanvasHeight}px` }}
        >
          {/* CORNER MARGIN STICKERS (STRICTLY PLACED IN BOARD OUTER CORNER MARGINS) */}
          <div className="absolute top-2.5 left-3 z-20 pointer-events-none">
            <StickerHeadphones className="scale-75 opacity-90" />
          </div>
          <div className="absolute top-2.5 right-3 z-20 pointer-events-none">
            <StickerCamera className="scale-75 opacity-90" />
          </div>
          <div className="absolute bottom-2.5 left-3 z-20 pointer-events-none">
            <StickerPlant className="scale-75 opacity-90" />
          </div>
          <div className="absolute bottom-2.5 right-3 z-20 pointer-events-none">
            <StickerLightbulb className="scale-75 opacity-90" />
          </div>

          {/* RENDERING ONLY ACTIVE ACTIVITY CARDS */}
          {boardSlots.map((slot) => (
            <div
              key={slot.slotId}
              className="absolute transition-all duration-300 ease-out"
              style={{
                top: slot.top,
                left: slot.left,
                zIndex: slot.zIndex || 10,
              }}
            >
              {slot.activityData && (
                <ActivityNoteCard
                  item={slot.activityData}
                  width={slot.width}
                  height={slot.height}
                  onClick={() => setSelectedActivity(slot.activityData || null)}
                />
              )}
            </div>
          ))}
        </div>

        {/* MOBILE & TABLET RESPONSIVE GRID */}
        <div className="block lg:hidden p-4 sm:p-5 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
            {boardSlots.map(
              (slot) =>
                slot.activityData && (
                  <div key={slot.slotId} className="w-full flex justify-center py-1">
                    <ActivityNoteCard
                      item={slot.activityData}
                      width="100%"
                      height="250px"
                      className="max-w-[250px]"
                      onClick={() => setSelectedActivity(slot.activityData || null)}
                    />
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      {/* INTERACTIVE DETAIL ZOOM MODAL */}
      <ActivityDetailModal
        item={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};
