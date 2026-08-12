"use client";

import React from "react";
import { Badge } from "../ui/Badge";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  centered = true,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col select-none mb-10 sm:mb-14",
        centered ? "items-center text-center max-w-3xl mx-auto" : "items-start text-left max-w-4xl",
        className
      )}
    >
      {badge && (
        <Badge variant="brand" size="md" className="mb-4">
          {badge}
        </Badge>
      )}

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F1115] font-headings leading-tight mb-4">
        {title}
      </h1>

      {description && (
        <p className="text-base sm:text-lg text-[#5F6773] font-medium leading-relaxed font-sans max-w-2xl">
          {description}
        </p>
      )}

      {children && <div className="mt-6 flex flex-wrap gap-4">{children}</div>}
    </div>
  );
};

PageHeader.displayName = "PageHeader";
