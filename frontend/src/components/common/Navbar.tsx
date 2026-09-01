"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown, UserRound, LogOut, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "../../config/site";
import { ROUTES } from "../../constants/routes";
import { Logo } from "./Logo";
import { Button } from "../ui/Button";
import { AuthUser, MemberProfile, getCurrentUser, getMemberProfile, clearCurrentUser } from "../../lib/memberAuth";
import { NavigationRepository } from "../../lib/navigationStore";
import { useLanguage } from "../../context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { language, t } = useLanguage();

  const translateNavTitle = (title: string) => {
    if (!title) return title;
    if (language !== "en") return title;

    const lower = title.toLocaleLowerCase("tr-TR").trim();
    if (lower === "ana sayfa") return "Home";
    if (lower === "hakkımızda" || lower === "hakkimizda") return "About Us";
    if (lower === "etkinlikler") return "Events";
    if (lower === "haberler") return "News";
    if (lower === "faaliyetler") return "Activities";
    if (lower === "dergiler") return "Magazines";
    if (lower === "ekipler") return "Teams";
    if (lower === "raporlar") return "Reports";
    if (lower.includes("iletişim") || lower.includes("iletisim")) return "Contact";
    if (lower === "sss" || lower === "faq") return "FAQ";
    if (lower === "üyeler" || lower === "uyeler") return "Members";
    if (lower.startsWith("çalışmalar") || lower.startsWith("calismalar")) return "Our Works";
    if (lower.startsWith("topluluk")) return "Community";
    if (lower.includes("çalışma ekipleri") || lower.includes("calisma ekipleri")) return "Working Teams";
    if (lower === "ekibimiz" || lower === "bizim ekip") return "Our Team";
    if (lower.includes("etkileşim") || lower.includes("katılım") || lower.includes("katilim")) return "Join & Engage";
    if (lower.includes("açık pozisyonlar") || lower.includes("acik pozisyonlar")) return "Open Positions";
    if (lower.includes("paydaş") || lower.includes("paydas")) return "Partners & Supporters";
    return title;
  };






  // Scroll, mobile menu, and desktop dropdown states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<MemberProfile | null>(null);
  const [navItemsList, setNavItemsList] = useState<any[]>(SITE_CONFIG.mainNav as any[]);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Fetch live navigation items from DB API and merge with default config
  useEffect(() => {
    NavigationRepository.fetchNavFromDB("NAVBAR", "visible").then((res) => {
      if (res && Array.isArray(res.navbar) && res.navbar.length > 0) {
        const dbMapped = res.navbar.map((item: any) => {
          const rawSlug = item.page?.slug;
          const rawHref = item.href;
          let href = rawHref || "#";

          if (item.targetType === "PAGE" && rawSlug) {
            if (rawSlug === "hakkimizda") href = "/hakkimizda";
            else if (rawSlug === "katilim") href = "/katilim";
            else if (rawSlug === "iletisim") href = "/iletisim";
            else if (rawSlug === "sss") href = "/sss";
            else if (rawSlug === "uyeler") href = "/uyeler";
            else if (rawSlug === "ekipler") href = "/ekipler";
            else if (rawSlug === "faaliyetler") href = "/faaliyetler";
            else if (rawSlug === "etkinlikler") href = "/etkinlikler";
            else if (rawSlug === "dergiler") href = "/dergiler";
            else if (rawSlug === "haberler") href = "/haberler";
            else if (rawSlug === "raporlar") href = "/raporlar";
            else href = `/sayfa/${rawSlug}`;
          } else if (rawHref === "/sayfa/hakkimizda") {
            href = "/hakkimizda";
          } else if (rawHref === "/sayfa/katilim") {
            href = "/katilim";
          } else if (rawHref === "/sayfa/iletisim") {
            href = "/iletisim";
          } else if (rawHref === "/sayfa/sss") {
            href = "/sss";
          }

          const children =
            item.children && item.children.length > 0
              ? item.children.map((child: any) => {
                  const childSlug = child.page?.slug;
                  const childRawHref = child.href;
                  let childHref = childRawHref || "#";

                  if (child.targetType === "PAGE" && childSlug) {
                    if (childSlug === "hakkimizda") childHref = "/hakkimizda";
                    else if (childSlug === "katilim") childHref = "/katilim";
                    else if (childSlug === "iletisim") childHref = "/iletisim";
                    else if (childSlug === "sss") childHref = "/sss";
                    else if (childSlug === "uyeler") childHref = "/uyeler";
                    else if (childSlug === "ekipler") childHref = "/ekipler";
                    else if (childSlug === "faaliyetler") childHref = "/faaliyetler";
                    else if (childSlug === "etkinlikler") childHref = "/etkinlikler";
                    else if (childSlug === "dergiler") childHref = "/dergiler";
                    else if (childSlug === "haberler") childHref = "/haberler";
                    else if (childSlug === "raporlar") childHref = "/raporlar";
                    else if (childSlug === "acik-pozisyonlar" || childSlug === "acikpozisyonlar") childHref = ROUTES.ACIK_POZISYONLAR;
                    else if (childSlug === "paydaslarimiz" || childSlug === "paydaslar") childHref = ROUTES.PAYDASLARIMIZ;
                    else childHref = `/sayfa/${childSlug}`;
                  } else if (childRawHref === "/sayfa/hakkimizda") {
                    childHref = "/hakkimizda";
                  } else if (childRawHref === "/sayfa/katilim") {
                    childHref = "/katilim";
                  } else if (childRawHref === "/sayfa/iletisim") {
                    childHref = "/iletisim";
                  } else if (childRawHref === "/sayfa/sss") {
                    childHref = "/sss";
                  }

                  const childTitle = String(child.label || "").trim() === "Üyelerimiz" ? "Ekibimiz" : child.label;
                  return {
                    title: childTitle,
                    href: childHref,
                    status: "active",
                  };
                })
              : undefined;

          const itemTitle = String(item.label || "").trim() === "Üyelerimiz" ? "Ekibimiz" : item.label;

          // Always guarantee Açık Pozisyonlar & Paydaşlarımız are in Topluluk dropdown
          if (itemTitle.toLowerCase().includes("topluluk")) {
            const finalChildren = children ? [...children] : [];
            const hasPositions = finalChildren.some(
              (c: any) =>
                c.href === ROUTES.ACIK_POZISYONLAR ||
                String(c.title).toLowerCase().includes("pozisyon")
            );
            if (!hasPositions) {
              const posItem = {
                title: "Açık Pozisyonlar",
                href: ROUTES.ACIK_POZISYONLAR,
                status: "active",
              };
              const sssIdx = finalChildren.findIndex(
                (c: any) =>
                  c.href === ROUTES.SSS ||
                  String(c.title).toLowerCase().includes("sss")
              );
              if (sssIdx !== -1) {
                finalChildren.splice(sssIdx, 0, posItem);
              } else {
                finalChildren.push(posItem);
              }
            }

            const hasPartners = finalChildren.some(
              (c: any) =>
                c.href === ROUTES.PAYDASLARIMIZ ||
                String(c.title).toLowerCase().includes("paydaş") ||
                String(c.title).toLowerCase().includes("paydas")
            );
            if (!hasPartners) {
              const partnerItem = {
                title: "Paydaşlarımız",
                href: ROUTES.PAYDASLARIMIZ,
                status: "active",
              };
              const sssIdx = finalChildren.findIndex(
                (c: any) =>
                  c.href === ROUTES.SSS ||
                  String(c.title).toLowerCase().includes("sss")
              );
              if (sssIdx !== -1) {
                finalChildren.splice(sssIdx, 0, partnerItem);
              } else {
                finalChildren.push(partnerItem);
              }
            }

            return {
              title: itemTitle,
              href,
              status: "active",
              items: finalChildren,
            };
          }


          return {
            title: itemTitle,
            href,
            status: "active",
            items: children,
          };
        });


        const staticNav = (SITE_CONFIG.mainNav || []) as any[];
        const dbTitles = dbMapped.map((d: any) => d.title.toLowerCase());
        
        const filteredStatic = staticNav.filter(
          (s: any) => !dbTitles.includes(s.title.toLowerCase())
        );

        setNavItemsList([...filteredStatic, ...dbMapped]);
      }
    });
  }, []);

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

  useEffect(() => {
    const syncUser = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
      setUserProfile(user ? getMemberProfile(user) : null);
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("focus", syncUser);
    window.addEventListener("profile-updated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("focus", syncUser);
      window.removeEventListener("profile-updated", syncUser);
    };
  }, [pathname]);

  // Keyboard navigation & accessibility helpers for mobile drawer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
        setActiveDropdown(null);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
      window.addEventListener("keydown", handleKeyDown);
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
    return href !== "#" && pathname.startsWith(href);
  };

  const isAdmin = Boolean(
    currentUser && (
      currentUser.role === "admin" ||
      (currentUser.role as string) === "ADMIN" ||
      currentUser.email?.toLowerCase() === "admin@napsak.com"
    )
  );

  const handleLogout = () => {
    clearCurrentUser();
    setCurrentUser(null);
    setLogoutConfirmOpen(false);
    router.push(ROUTES.HOME);
  };

  const requestLogout = () => {
    setIsMobileMenuOpen(false);
    setLogoutConfirmOpen(true);
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      transition={transitionConfig}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full h-[88px] transition-all duration-300 ease-in-out border-b",
        isScrolled
          ? "bg-[#07452C]/95 border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-md"
          : "bg-black/40 border-white/10 backdrop-blur-md"
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo - Left */}
        <Link
          href={ROUTES.HOME}
          className="flex items-center justify-center select-none outline-none focus-visible:ring-4 focus-visible:ring-white/20 rounded-lg p-1 transition-all shrink-0"
          aria-label="N'apsak? Ana Sayfa"
        >
          <Logo
            variant="default"
            size={72}
            priority
            className="transition-all duration-300 ease-in-out filter brightness-110 flex items-center justify-center shrink-0"
          />
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2 lg:gap-5" aria-label="Ana Navigasyon">
          {navItemsList.map((item: any) => {
            const hasSubItems = Boolean(item.items && item.items.length > 0);
            const isPassive = item.status === "coming-soon";
            const active = isLinkActive(item.href);

            // Dropdown Item (Çalışmalar, Topluluk etc.)
            if (hasSubItems) {
              const isOpen = activeDropdown === item.title;
              const hasActiveChild = item.items?.some((child: any) => isLinkActive(child.href));

              return (
                <div
                  key={item.title}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(isOpen ? null : item.title)}
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-medium transition-colors py-1 px-2.5 rounded-md outline-none select-none focus-visible:ring-4 focus-visible:ring-white/20 cursor-pointer",
                      hasActiveChild
                        ? "text-white font-semibold"
                        : isPassive
                        ? "text-white/60 hover:text-white/80"
                        : "text-white/80 hover:text-white"
                    )}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    <span>{translateNavTitle(item.title)}</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200",
                        isOpen ? "rotate-180 text-white" : "text-white/60"
                      )}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-1 min-w-[210px] bg-[#07452C]/95 border border-white/15 shadow-[0_16px_36px_rgba(0,0,0,0.4)] backdrop-blur-xl rounded-xl p-1.5 z-50 flex flex-col gap-0.5"
                      >
                        {item.items?.map((subItem: any) => {
                          const isSubPassive = subItem.status === "coming-soon";

                          if (isSubPassive) {
                            return (
                              <div
                                key={subItem.title}
                                className="flex items-center justify-between px-3 py-2 text-xs font-medium text-white/40 cursor-not-allowed select-none rounded-lg hover:bg-white/[0.03]"
                                title="Yakında Hizmetinizde"
                              >
                                <span>{translateNavTitle(subItem.title)}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-normal">
                                  {t("nav.comingSoon", "Yakında")}
                                </span>
                              </div>
                            );
                          }

                          const subActive = isLinkActive(subItem.href);
                          return (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              onClick={() => setActiveDropdown(null)}
                              className={cn(
                                "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                                subActive
                                  ? "bg-white/20 text-white font-semibold shadow-sm"
                                  : "text-white/80 hover:bg-white/10 hover:text-white"
                              )}
                            >
                              <span>{translateNavTitle(subItem.title)}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // Single Passive Item
            if (isPassive) {
              return (
                <span
                  key={item.title}
                  className="flex items-center gap-1.5 text-sm font-medium text-white/40 cursor-not-allowed select-none py-1 px-2.5"
                  title="Yakında Hizmetinizde"
                  onClick={(e) => e.preventDefault()}
                >
                  <span>{translateNavTitle(item.title)}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 font-normal">
                    {t("nav.comingSoon", "Yakında")}
                  </span>
                </span>
              );
            }

            // Single Active Item
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
                {translateNavTitle(item.title)}
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

        {/* Right Action Buttons: Giriş Yap, Kayıt Ol, Topluluğa Katıl & Language Switcher (En sağda) */}
        <div className="hidden lg:flex items-center gap-2 lg:gap-3">
          {currentUser ? (
            isAdmin ? (
              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  href={ROUTES.ADMIN}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-emerald-400/40 bg-[#0A5C3A] text-white text-xs sm:text-sm font-semibold hover:bg-[#128C59] transition-all shadow-xs whitespace-nowrap shrink-0"
                  title={t("nav.admin")}
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2]" />
                  <span>{t("nav.admin")}</span>
                </Link>

                <button
                  type="button"
                  onClick={requestLogout}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/25 bg-white/10 text-white text-xs sm:text-sm font-semibold hover:bg-rose-500/20 hover:border-rose-400/40 hover:text-rose-200 transition-all cursor-pointer whitespace-nowrap shrink-0"
                  title={t("nav.logout")}
                >
                  <LogOut className="w-4 h-4 stroke-[2]" />
                  <span>{t("nav.logout")}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={ROUTES.PROFIL}
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/12 text-white overflow-hidden transition hover:bg-white/22 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                  aria-label={t("nav.profile")}
                  title={t("nav.profile")}
                >
                  {userProfile?.avatar ? (
                    <img src={userProfile.avatar} alt={t("nav.profile")} className="h-full w-full object-cover rounded-full" />
                  ) : (
                    <UserRound className="h-4.5 w-4.5" />
                  )}
                </Link>

                <button
                  type="button"
                  onClick={requestLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-xs font-medium hover:bg-rose-500/20 hover:border-rose-400/40 hover:text-rose-200 transition-all cursor-pointer"
                  title={t("nav.logout")}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{t("nav.logout")}</span>
                </button>
              </div>
            )
          ) : (
            <>
              <Button
                href={ROUTES.LOGIN}
                variant="secondary"
                size="sm"
                className="!bg-white/10 !text-white !border-white/25 hover:!bg-white/20 font-semibold text-xs px-3.5 h-9"
              >
                {t("nav.login")}
              </Button>

              <Button
                href={ROUTES.KAYIT}
                variant="secondary"
                size="sm"
                className="!bg-white/15 !text-white !border-white/30 hover:!bg-white/25 font-semibold text-xs px-3.5 h-9"
              >
                {t("nav.register")}
              </Button>

              <Button
                href={ROUTES.BASVURU}
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5 stroke-[2]" />}
                className="!bg-[#0A5C3A] hover:!bg-[#0D7449] !text-white font-semibold text-xs px-3.5 h-9 shadow-md"
              >
                {t("nav.join")}
              </Button>
            </>
          )}

          {/* Dil Seçici (En sağda, Topluluğa Katıl butonunun yanında) */}
          <LanguageSwitcher />
        </div>



        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center lg:hidden">
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
            className="absolute top-full left-0 right-0 z-40 w-full bg-[#07452C] border-b border-white/15 shadow-2xl lg:hidden max-h-[calc(100vh-80px)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil Menü"
          >
            <div className="px-4 pt-4 pb-6 space-y-3 bg-black/20">
              <nav className="flex flex-col gap-2" aria-label="Mobil Navigasyon">
                {navItemsList.map((item: any) => {
                  const hasSubItems = Boolean(item.items && item.items.length > 0);
                  const isPassive = item.status === "coming-soon";
                  const active = isLinkActive(item.href);

                  if (hasSubItems) {
                    return (
                      <div key={item.title} className="flex flex-col gap-1 py-1">
                        <div className="flex items-center justify-between px-3 pt-2 pb-1 text-xs font-bold text-white/50 uppercase tracking-wider">
                          <span>{translateNavTitle(item.title)}</span>
                          {isPassive && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/40 font-normal">
                              {t("nav.comingSoon", "Yakında")}
                            </span>
                          )}
                        </div>
                        <div className="pl-3 border-l-2 border-white/15 flex flex-col gap-1">
                          {item.items?.map((sub: any) => {
                            const isSubPassive = sub.status === "coming-soon";

                            if (isSubPassive) {
                              return (
                                <div
                                  key={sub.title}
                                  className="flex items-center justify-between h-10 px-3 text-sm font-medium rounded-lg text-white/40 cursor-not-allowed select-none bg-white/[0.02]"
                                >
                                  <span>{translateNavTitle(sub.title)}</span>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/40 font-normal">
                                    {t("nav.comingSoon", "Yakında")}
                                  </span>
                                </div>
                              );
                            }

                            const subActive = isLinkActive(sub.href);
                            return (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                  "flex items-center h-10 px-3 text-sm font-medium rounded-lg transition-all outline-none focus-visible:ring-4 focus-visible:ring-white/20",
                                  subActive
                                    ? "bg-white/20 text-white font-semibold"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                                )}
                              >
                                {translateNavTitle(sub.title)}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (isPassive) {
                    return (
                      <div
                        key={item.title}
                        className="flex items-center justify-between h-11 px-4 text-base font-medium rounded-lg text-white/40 cursor-not-allowed select-none bg-white/[0.02]"
                      >
                        <span>{translateNavTitle(item.title)}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/50 font-normal">
                          {t("nav.comingSoon", "Yakında")}
                        </span>
                      </div>
                    );
                  }

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
                      {translateNavTitle(item.title)}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-white/15 flex flex-col gap-2.5">
                <div className="flex items-center justify-between px-3 py-2 bg-white/10 rounded-xl border border-white/15">
                  <span className="text-xs text-white/90 font-bold">{t("a11y.languageSelector", "Dil Seçimi")}</span>
                  <LanguageSwitcher />
                </div>

                {currentUser && (
                  isAdmin ? (
                    <div className="flex flex-col gap-2">
                      <Button
                        href={ROUTES.ADMIN}
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={() => setIsMobileMenuOpen(false)}
                        leftIcon={<ShieldCheck className="h-4 w-4" />}
                        className="!bg-[#0A5C3A] hover:!bg-[#0D7449] !text-white font-semibold text-sm"
                      >
                        {t("nav.admin")}
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        fullWidth
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          requestLogout();
                        }}
                        leftIcon={<LogOut className="h-4 w-4" />}
                        className="!bg-rose-500/20 !text-rose-200 !border-rose-400/30 hover:!bg-rose-500/30 font-semibold text-sm"
                      >
                        {t("nav.logout")}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        href={ROUTES.PROFIL}
                        variant="secondary"
                        size="lg"
                        fullWidth
                        onClick={() => setIsMobileMenuOpen(false)}
                        leftIcon={
                          userProfile?.avatar ? (
                            <img src={userProfile.avatar} alt={t("nav.profile")} className="h-5 w-5 rounded-full object-cover shrink-0" />
                          ) : (
                            <UserRound className="h-4 w-4" />
                          )
                        }
                        className="!bg-white/15 !text-white !border-white/30 hover:!bg-white/25 font-semibold text-sm flex-1"
                      >
                        {t("nav.profile")}
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          requestLogout();
                        }}
                        className="!bg-rose-500/20 !text-rose-200 !border-rose-400/30 hover:!bg-rose-500/30 font-semibold text-sm px-3.5"
                        title={t("nav.logout")}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                )}

                {!currentUser && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        href={ROUTES.LOGIN}
                        variant="secondary"
                        size="lg"
                        fullWidth
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="!bg-white/10 !text-white !border-white/30 hover:!bg-white/20 font-semibold text-sm"
                      >
                        {t("nav.login")}
                      </Button>

                      <Button
                        href={ROUTES.KAYIT}
                        variant="secondary"
                        size="lg"
                        fullWidth
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="!bg-white/20 !text-white !border-white/30 hover:!bg-white/30 font-semibold text-sm"
                      >
                        {t("nav.register")}
                      </Button>
                    </div>

                    <Button
                      href={ROUTES.BASVURU}
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={() => setIsMobileMenuOpen(false)}
                      rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
                      className="!bg-[#0A5C3A] hover:!bg-[#0D7449] !text-white font-semibold text-sm shadow-md"
                    >
                      {t("nav.join")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {logoutConfirmOpen && (
              <motion.div
                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-confirm-title"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.96 }}
                  transition={transitionConfig}
                  className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-[#0F1115] shadow-2xl"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-[#0A5C3A]">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 id="logout-confirm-title" className="text-lg font-extrabold text-[#0F1115]">
                        Çıkış Yap
                      </h2>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-[#5F6773]">
                        Çıkış yapmak istediğinizden emin misiniz?
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setLogoutConfirmOpen(false)}
                      className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-xl bg-[#0A5C3A] hover:bg-[#084A2F] px-4.5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#0A5C3A]/20 transition-colors"
                    >
                      Evet, Çıkış Yap
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </motion.header>
  );
};

Navbar.displayName = "Navbar";
