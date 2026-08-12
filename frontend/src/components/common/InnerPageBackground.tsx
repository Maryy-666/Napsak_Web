"use client";

import React from "react";
import { PageBackground } from "./PageBackground";

interface InnerPageBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export function InnerPageBackground({
  children,
  className = "",
  id = "inner-page-root",
}: InnerPageBackgroundProps) {
  return (
    <PageBackground className={className} id={id}>
      {children}
    </PageBackground>
  );
}

export default InnerPageBackground;

