/**
 * Ne Yapsak? Gençlik Derneği - Frontend Design System v1 Tokens
 * Centralized design tokens for colors, typography, spacing, radius, shadows, and transitions.
 */

export const TOKENS = {
  colors: {
    brand: {
      primary: "#0A5C3A",
      hover: "#0D7449",
      active: "#07452C",
      glow: "rgba(10, 92, 58, 0.12)",
      subtleBg: "rgba(10, 92, 58, 0.04)",
    },
    text: {
      primary: "#0F1115",
      secondary: "#5F6773",
      muted: "#9FA6B2",
      inverse: "#FFFFFF",
    },
    surface: {
      white: "#FFFFFF",
      subtle: "#F8F9FA",
      active: "#F1F3F5",
      border: "#EEF0F2",
      glass: "rgba(255, 255, 255, 0.84)",
    },
    status: {
      error: "#DC2626",
      errorBg: "#FEF2F2",
      success: "#0A5C3A",
      successBg: "#EEF7F3",
      warning: "#D97706",
      warningBg: "#FFFBEB",
    },
  },
  typography: {
    fontSans: "var(--font-sans), 'Inter', sans-serif",
    fontHeadings: "var(--font-headings), 'Plus Jakarta Sans', sans-serif",
  },
  layout: {
    containerMaxWidth: "max-w-7xl",
    containerPadding: "px-4 sm:px-6 lg:px-8",
    headerHeightScrolled: "h-16",
    headerHeightDefault: "h-20",
    contentTopPadding: "pt-20",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "14px",
    xl: "20px",
    xxl: "24px",
    full: "9999px",
  },
  shadows: {
    subtle: "0 1px 2px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.03)",
    elevated: "0 2px 4px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.04)",
    brandGlow: "0 8px 20px rgba(10,92,58,0.18)",
    authCard: "0 30px 80px rgba(15,17,21,0.08)",
  },
  transitions: {
    fast: "150ms ease-in-out",
    normal: "250ms cubic-bezier(0.16, 1, 0.3, 1)",
  },
} as const;

export type Tokens = typeof TOKENS;
