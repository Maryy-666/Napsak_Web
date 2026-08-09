export const COLORS = {
  // Brand Green (Primary)
  BRAND_GREEN: "#0A5C3A",
  BRAND_GREEN_HOVER: "#0D7449",
  BRAND_GREEN_ACTIVE: "#07452C",
  BRAND_GREEN_GLOW: "rgba(10, 92, 58, 0.12)",

  // Neutrals / Typography
  TEXT_PRIMARY: "#0F1115",
  TEXT_SECONDARY: "#5F6773",
  TEXT_MUTED: "#9FA6B2",

  // Borders & Surfaces
  BORDER_LIGHT: "#EEF0F2",
  BG_HOVER: "#F8F9FA",
  BG_ACTIVE: "#F1F3F5",
  BG_GLASS: "rgba(255, 255, 255, 0.75)",

  // Statuses
  ERROR: "#DC2626",
} as const;

export type ColorKey = keyof typeof COLORS;
export type ColorValue = typeof COLORS[ColorKey];
