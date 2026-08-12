"use client";

import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "../../config/site";
import { ROUTES } from "../../constants/routes";
import { Logo } from "./Logo";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-[#EEF0F2] py-10 px-4 sm:px-6 lg:px-8 z-10 relative select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Logo & Description */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link
            href={ROUTES.HOME}
            className="flex items-center outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/12 rounded-lg"
            aria-label="N'apsak? Ana Sayfa"
          >
            <Logo variant="default" size={90} priority />
          </Link>
          <p className="text-xs text-[#5F6773] text-center md:text-left max-w-sm font-sans font-medium">
            {SITE_CONFIG.description}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center items-center gap-5 sm:gap-6" aria-label="Footer Navigasyon">
          {SITE_CONFIG.mainNav.map((item) => {
            const isPassive = item.status === "coming-soon";

            if (isPassive) {
              return (
                <span
                  key={item.title}
                  className="text-xs font-medium text-[#9FA6B2] cursor-not-allowed select-none opacity-70 flex items-center gap-1"
                  title="Yakında"
                >
                  {item.title}
                  <span className="text-[9px] px-1 py-0.5 rounded bg-black/5 text-[#7E8794]">Yakında</span>
                </span>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href}
                className="text-xs font-medium text-[#5F6773] hover:text-[#0A5C3A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A]/12 rounded-sm"
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Copyright & Legal Links */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-[#9FA6B2] text-center md:text-right font-sans font-normal">
          <Link
            href={ROUTES.KVKK}
            className="hover:text-[#0A5C3A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A]/12 rounded-sm"
          >
            KVKK Aydınlatma Metni
          </Link>
          <span className="hidden sm:inline">•</span>
          <span>© {currentYear} {SITE_CONFIG.name}. Tüm hakları saklıdır.</span>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
