"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "../../config/site";
import { ROUTES } from "../../constants/routes";
import { Logo } from "./Logo";
import { Button } from "../ui/Button";

// Helper function to merge classes
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  
  // Navigation states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Menu references for keyboard event handling
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for height shrink effect using a passive listener for performance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to handle reload states
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
      document.body.style.overflow = "hidden"; // Prevent background scrolling
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Dynamic animation configurations respecting reduced motion settings
  const transitionConfig = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }; // easeOutExpo

  const navbarVariants = {
    hidden: { y: -16, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const drawerVariants = {
    closed: { opacity: 0, y: -20 },
    open: { opacity: 1, y: 0 },
  };

  // Helper function to check active state of navigation links
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
          ? "h-16 bg-white/80 border-[#EEF0F2]/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
          : "h-20 bg-white/70 border-transparent",
        "backdrop-blur-md"
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo - Left */}
        <Link 
          href={ROUTES.HOME} 
          className="flex items-center select-none outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/12 rounded-lg p-1.5 transition-shadow"
          aria-label="N'apsak? Ana Sayfa"
        >
          {/* Scroll transitions scaling of brand Logo smoothly */}
          <Logo variant="default" size={isScrolled ? 90 : 105} priority className="transition-all duration-300 ease-in-out" />
        </Link>

        {/* Desktop Navigation Menu - Center */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Ana Navigasyon">
          {SITE_CONFIG.mainNav.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1 select-none outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/12 rounded-md px-2",
                  active
                    ? "text-[#0A5C3A]"
                    : "text-[#5F6773] hover:text-[#0F1115]"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.title}
                {/* Visual active state bottom glow indicator */}
                {active && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    transition={transitionConfig}
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#0A5C3A] rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button / Actions Area - Right */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            href={ROUTES.LOGIN}
            variant="secondary"
            size="md"
            className="text-sm font-semibold"
          >
            Giriş Yap
          </Button>
        </div>

        {/* Hamburger Mobile Menu Toggle Button */}
        <div className="flex items-center md:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-[#5F6773] hover:bg-[#F8F9FA] hover:text-[#0F1115] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/12 transition-all select-none cursor-pointer"
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

      {/* Mobile Navigation Full-screen Drawer Overlay */}
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
            className="absolute top-full left-0 right-0 z-40 w-full bg-white border-b border-[#EEF0F2] shadow-xl md:hidden overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil Menü"
          >
            <div className="px-4 pt-4 pb-6 space-y-3 bg-[#F8F9FA]/50">
              <nav className="flex flex-col gap-1" aria-label="Mobil Navigasyon">
                {SITE_CONFIG.mainNav.map((item) => {
                  const active = isLinkActive(item.href);
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center h-11 px-4 text-base font-medium rounded-lg transition-all outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/12",
                        active
                          ? "bg-[#0A5C3A]/6 text-[#0A5C3A] font-semibold"
                          : "text-[#5F6773] hover:bg-[#F1F3F5] hover:text-[#0F1115]"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
              <div className="pt-4 border-t border-[#EEF0F2]/80 flex flex-col gap-3">
                <Button
                  href={ROUTES.LOGIN}
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Giriş Yap
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
