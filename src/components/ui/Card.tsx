"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

// Simple utility function to merge classes without external library dependencies
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

type CardVariant = "default" | "elevated" | "outlined" | "auth";

export interface CardProps extends Omit<HTMLMotionProps<"section">, "title"> {
  variant?: CardVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  animate?: boolean;
  hoverElevation?: boolean;
}

export const Card = forwardRef<HTMLElement, CardProps>(
  (
    {
      className,
      variant = "default",
      title,
      description,
      header,
      footer,
      animate = true,
      hoverElevation = false,
      children,
      ...props
    },
    ref
  ) => {
    // Styling states based on v1.1 Design System Spec
    const variantClasses: Record<CardVariant, string> = {
      default: cn(
        "bg-white border border-[#EEF0F2]",
        "shadow-[0px_1px_2px_rgba(0,0,0,0.02),0px_4px_12px_rgba(0,0,0,0.03)]",
        "rounded-[12px] p-5 sm:p-6"
      ),
      elevated: cn(
        "bg-white border border-[#EEF0F2]/50",
        "shadow-[0px_2px_4px_rgba(0,0,0,0.02),0px_8px_24px_rgba(0,0,0,0.04)]",
        "rounded-[12px] p-5 sm:p-6"
      ),
      outlined: cn(
        "bg-white border border-[#EEF0F2] shadow-none",
        "rounded-[12px] p-5 sm:p-6"
      ),
      auth: cn(
        // Premium glassmorphism surface — v1.3 Design System Spec
        "bg-white/[0.82] backdrop-blur-[22px] [-webkit-backdrop-filter:blur(22px)]",
        "border border-white/[0.65] w-full max-w-[560px]",
        "shadow-[0_20px_60px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]",
        "rounded-[24px] p-6 sm:p-10"
      ),
    };

    // Framer Motion entry configurations (Fade-In-Up)
    const entryVariants = {
      hidden: { opacity: 0, y: 8 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1], // easeOutExpo
        },
      },
    };

    // Hover state micro-lift animations
    const hoverAnimation =
      hoverElevation && variant !== "auth"
        ? {
            y: -2,
            boxShadow:
              variant === "outlined"
                ? "0px 4px 12px rgba(0, 0, 0, 0.03)"
                : "0px 8px 24px rgba(0, 0, 0, 0.06)",
          }
        : undefined;

    return (
      <motion.section
        ref={ref as any}
        initial={animate ? "hidden" : undefined}
        animate={animate ? "visible" : undefined}
        whileHover={hoverAnimation}
        variants={entryVariants}
        className={cn(
          "flex flex-col text-left transition-shadow duration-150 relative overflow-hidden",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {/* Custom Header Layout */}
        {header && <div className="mb-4">{header}</div>}

        {/* Standard Typographic Title/Description Header Block */}
        {(title || description) && !header && (
          <div className="flex flex-col gap-1.5 mb-5 select-none">
            {title && (
              <h2 className="text-xl font-semibold text-[#0F1115] tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-[#5F6773] leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content Body Area */}
        <div className="flex-1 w-full">{children}</div>

        {/* Custom Footer Layout */}
        {footer && <div className="mt-6 pt-4 border-t border-[#EEF0F2]">{footer}</div>}
      </motion.section>
    );
  }
);

Card.displayName = "Card";
