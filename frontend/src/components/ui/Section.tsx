"use client";

import React from "react";
import { PageContainer } from "./PageContainer";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export type SectionPadding = "none" | "sm" | "md" | "lg";
export type SectionBackground = "transparent" | "white" | "subtle";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  padding?: SectionPadding;
  background?: SectionBackground;
  withContainer?: boolean;
  containerClassName?: string;
}

export const Section: React.FC<SectionProps> = ({
  as: Component = "section",
  className,
  padding = "md",
  background = "transparent",
  withContainer = true,
  containerClassName,
  children,
  ...props
}) => {
  const paddingClasses: Record<SectionPadding, string> = {
    none: "py-0",
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16 lg:py-20",
    lg: "py-16 sm:py-24 lg:py-32",
  };

  const bgClasses: Record<SectionBackground, string> = {
    transparent: "bg-transparent",
    white: "bg-white",
    subtle: "bg-[#F8F9FA]",
  };

  const content = withContainer ? (
    <PageContainer className={containerClassName}>{children}</PageContainer>
  ) : (
    children
  );

  return (
    <Component
      className={cn(
        "w-full relative",
        paddingClasses[padding],
        bgClasses[background],
        className
      )}
      {...props}
    >
      {content}
    </Component>
  );
};

Section.displayName = "Section";
