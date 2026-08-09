"use client";

import React from "react";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  cleanPadding?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  as: Component = "div",
  className,
  cleanPadding = false,
  children,
  ...props
}) => {
  return (
    <Component
      className={cn(
        "w-full max-w-7xl mx-auto",
        !cleanPadding && "px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

PageContainer.displayName = "PageContainer";
