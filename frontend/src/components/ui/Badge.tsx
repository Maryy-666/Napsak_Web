"use client";

import React from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export type BadgeVariant = "default" | "brand" | "outline" | "success" | "warning" | "error";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "brand",
  size = "md",
  icon,
  children,
  ...props
}) => {
  const sizeClasses: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-xs gap-1 rounded-md font-medium",
    md: "px-2.5 py-1 text-xs sm:text-sm gap-1.5 rounded-lg font-semibold",
  };

  const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-[#F1F3F5] text-[#0F1115] border border-[#EEF0F2]",
    brand: "bg-[#0A5C3A]/10 text-[#0A5C3A] border border-[#0A5C3A]/20",
    outline: "bg-transparent text-[#5F6773] border border-[#EEF0F2]",
    success: "bg-[#EEF7F3] text-[#0A5C3A] border border-[#0A5C3A]/20",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    error: "bg-red-50 text-[#DC2626] border border-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center select-none font-sans leading-none transition-colors",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center justify-center">{icon}</span>}
      {children}
    </span>
  );
};

Badge.displayName = "Badge";
