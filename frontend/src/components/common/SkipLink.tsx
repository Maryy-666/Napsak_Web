"use client";

import React from "react";

export function SkipLink() {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainTarget = document.querySelector("main") || document.getElementById("main-content");
    if (mainTarget) {
      if (!mainTarget.hasAttribute("tabIndex")) {
        mainTarget.setAttribute("tabIndex", "-1");
      }
      mainTarget.focus({ preventScroll: false });
      mainTarget.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[1000] focus:px-4 focus:py-2.5 focus:bg-[#07452C] focus:text-white focus:rounded-xl focus:font-bold focus:text-sm focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#07452C]/40 focus:border focus:border-white/30 transition-all cursor-pointer"
    >
      Ana İçeriğe Geç
    </a>
  );
}
