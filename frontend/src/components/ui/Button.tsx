"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

// Simple utility function to merge classes without external library dependencies
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

// Define base props shared by both button and link behaviors
interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  href?: string;
  external?: boolean;
}

// Combine custom props with Framer Motion button attributes
export interface ButtonProps
  extends BaseButtonProps,
    Omit<HTMLMotionProps<"button">, keyof BaseButtonProps> {}

export const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      href,
      external,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const isLink = !!href;
    const isCurrentlyDisabled = disabled || isLoading;

    // Design System Spacing & Height Tokens
    const sizeClasses: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-xs gap-1.5 rounded-[8px]",
      md: "h-10 px-4 text-sm gap-2 rounded-[8px]",
      lg: "h-12 px-6 text-base gap-2.5 rounded-[8px]",
    };

    // Design System Color & State Tokens
    const variantClasses: Record<ButtonVariant, string> = {
      primary: cn(
        "bg-[#0A5C3A] text-white font-semibold shadow-[0_1px_2px_rgba(10,92,58,0.18)]",
        "hover:bg-[#0D7449]",
        "active:bg-[#07452C]",
        "focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/12 focus-visible:outline-none"
      ),
      secondary: cn(
        "bg-white border border-[#EEF0F2] text-[#0F1115] font-medium shadow-[0_1px_2px_rgba(15,17,21,0.03)]",
        "hover:bg-[#F8F9FA] hover:border-[#0A5C3A]/30 hover:text-[#0A5C3A]",
        "active:bg-[#EEF7F3]",
        "focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/12 focus-visible:outline-none"
      ),
      outline: cn(
        "bg-transparent border border-[#0A5C3A] text-[#0A5C3A] font-semibold",
        "hover:bg-[#0A5C3A]/5 hover:border-[#0D7449]",
        "active:bg-[#0A5C3A]/10",
        "focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/12 focus-visible:outline-none"
      ),
      ghost: cn(
        "bg-transparent text-[#5F6773] font-medium",
        "hover:bg-[#F1F3F5] hover:text-[#0F1115]",
        "active:bg-[#F1F3F5]/80",
        "focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/12 focus-visible:outline-none"
      ),
    };

    // Tactile Elevation Tokens — buttons feel "pressable" via depth (translateY + shadow),
    // not flashy scale animation. Respects prefers-reduced-motion via Framer Motion's
    // built-in reduced-motion handling for transform-based animations.
    const elevationVariants: Record<ButtonVariant, { hover: object; tap: object }> = {
      primary: {
        hover: {
          y: -1,
          boxShadow: "0 8px 20px rgba(10,92,58,0.18)",
        },
        tap: {
          y: 0,
          boxShadow: "0 2px 6px -1px rgba(10,92,58,0.25)",
        },
      },
      secondary: {
        hover: {
          y: -1,
          boxShadow:
            "0 6px 16px -4px rgba(15,17,21,0.10), 0 2px 4px rgba(15,17,21,0.04)",
        },
        tap: {
          y: 0,
          boxShadow: "0 1px 2px rgba(15,17,21,0.04)",
        },
      },
      outline: {
        hover: {
          y: -1,
          boxShadow: "0 6px 16px -4px rgba(10,92,58,0.10)",
        },
        tap: {
          y: 0,
          boxShadow: "none",
        },
      },
      ghost: {
        hover: { y: 0 },
        tap: { y: 0 },
      },
    };

    const baseClasses = cn(
      "inline-flex items-center justify-center select-none transition-all duration-150 relative",
      fullWidth ? "w-full flex" : "w-auto",
      sizeClasses[size],
      isCurrentlyDisabled
        ? "!bg-[#E5E7EB] !border-[#D1D5DB] !text-[#9FA6B2] !shadow-none cursor-not-allowed pointer-events-none"
        : cn("cursor-pointer hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99]", variantClasses[variant]),
      className
    );

    const content = (
      <>
        {/* Loading Spinner */}
        {isLoading && (
          <Loader2
            className={cn(
              "animate-spin stroke-[2px]",
              size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"
            )}
            aria-hidden="true"
          />
        )}

        {/* Left Icon (only visible when not loading) */}
        {!isLoading && leftIcon && (
          <span className="flex items-center justify-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Button Label */}
        <span className={cn("inline-flex items-center", isLoading && "opacity-80")}>
          {children as React.ReactNode}
        </span>

        {/* Right Icon */}
        {!isLoading && rightIcon && (
          <span className="flex items-center justify-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </>
    );

    // Render polymorphic Link anchor
    if (isLink) {
      const isExternalLink = external || href.startsWith("http");

      return (
        <Link
          href={isCurrentlyDisabled ? "#" : href}
          ref={ref as any}
          className={baseClasses}
          target={isExternalLink ? "_blank" : undefined}
          rel={isExternalLink ? "noopener noreferrer" : undefined}
          aria-disabled={isCurrentlyDisabled}
          tabIndex={isCurrentlyDisabled ? -1 : 0}
          onClick={isCurrentlyDisabled ? (e) => e.preventDefault() : onClick}
          {...(props as any)}
        >
          {content}
        </Link>
      );
    }

    // Render standard HTML Button
    return (
      <button
        type="button"
        ref={ref as any}
        className={baseClasses}
        disabled={isCurrentlyDisabled}
        onClick={isCurrentlyDisabled ? undefined : onClick}
        aria-busy={isLoading}
        aria-disabled={isCurrentlyDisabled}
        {...(props as any)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
