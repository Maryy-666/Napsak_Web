"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "../../config/site";
import { ROUTES } from "../../constants/routes";
import { Logo } from "./Logo";
import { Button } from "../ui/Button";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Scroll and mobile menu states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll state using a passive scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Keyboard navigation & accessibility helpers for mobile drawer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const transitionConfig = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

  const navbarVariants = {
    hidden: { y: -16, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const drawerVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 },
  };

  const isLinkActive = (href: string) => {
    if (href === ROUTES.HOME) {
      return pathname === ROUTES.HOME;
    }
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      transition={transitionConfig}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out border-b",
        isScrolled
          ? "h-16 bg-[#07452C]/95 border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-md"
          : "h-20 bg-black/40 border-white/10 backdrop-blur-md"
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo - Left */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center select-none outline-none focus-visible:ring-4 focus-visible:ring-white/20 rounded-lg p-1 transition-shadow"
          aria-label="N'apsak? Ana Sayfa"
        >
          <Logo
            variant="default"
            size={isScrolled ? 90 : 105}
            priority
            className="transition-all duration-300 ease-in-out filter brightness-110"
          />
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Ana Navigasyon">
          {SITE_CONFIG.mainNav.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1 select-none outline-none focus-visible:ring-4 focus-visible:ring-white/20 rounded-md px-2.5",
                  active
                    ? "text-white font-semibold"
                    : "text-white/80 hover:text-white"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.title}
                {/* Active Indicator Underline */}
                {active && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    transition={transitionConfig}
                    className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#0A5C3A] rounded-full shadow-[0_0_8px_#0A5C3A]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Dual Action Buttons: Giriş Yap & Topluluğa Katıl */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            href={ROUTES.LOGIN}
            variant="secondary"
            size="sm"
            className="!bg-white/10 !text-white !border-white/25 hover:!bg-white/20 font-semibold text-xs px-4 h-9"
          >
            Giriş Yap
          </Button>

          <Button
            href={ROUTES.BASVURU}
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5 stroke-[2]" />}
            className="!bg-[#0A5C3A] hover:!bg-[#0D7449] !text-white font-semibold text-xs px-4 h-9 shadow-md"
          >
            Topluluğa Katıl
          </Button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center md:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 transition-all select-none cursor-pointer"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-drawer"
            aria-label={isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[2px]" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6 stroke-[2px]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-drawer"
            ref={drawerRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            transition={transitionConfig}
            className="absolute top-full left-0 right-0 z-40 w-full bg-[#07452C] border-b border-white/15 shadow-2xl md:hidden overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil Menü"
          >
            <div className="px-4 pt-4 pb-6 space-y-3 bg-black/20">
              <nav className="flex flex-col gap-1.5" aria-label="Mobil Navigasyon">
                {SITE_CONFIG.mainNav.map((item) => {
                  const active = isLinkActive(item.href);
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center h-11 px-4 text-base font-medium rounded-lg transition-all outline-none focus-visible:ring-4 focus-visible:ring-white/20",
                        active
                          ? "bg-white/15 text-white font-semibold"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-white/15 flex flex-col gap-3">
                <Button
                  href={ROUTES.LOGIN}
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="!bg-white/10 !text-white !border-white/30 hover:!bg-white/20 font-semibold"
                >
                  Giriş Yap
                </Button>

                <Button
                  href={ROUTES.BASVURU}
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="!bg-[#0A5C3A] hover:!bg-[#0D7449] !text-white font-semibold"
                >
                  Topluluğa Katıl
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

Navbar.displayName = "Navbar";
