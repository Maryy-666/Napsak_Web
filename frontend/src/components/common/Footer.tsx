"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "../../constants/routes";
import { NavigationRepository } from "../../lib/navigationStore";
import { Logo } from "./Logo";
import { useLanguage } from "../../context/LanguageContext";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();

  const translateFooterTitle = (title: string) => {
    if (!title) return title;
    const lower = title.toLowerCase().trim();
    if (lower === "ana sayfa") return t("nav.home");
    if (lower === "hakkımızda") return t("nav.about");
    if (lower === "etkinlikler") return t("nav.events");
    if (lower === "çalışmalar" || lower === "faaliyetler") return t("nav.activities");
    if (lower === "dernek" || lower === "üyeler") return t("nav.community");
    if (lower === "iletişim") return t("nav.contact");
    return title;
  };

  const fallbackNavLinks = [
    { title: "Ana Sayfa", href: ROUTES.HOME },
    { title: "Hakkımızda", href: ROUTES.HAKKIMIZDA },
    { title: "Etkinlikler", href: ROUTES.ETKINLIKLER },
    { title: "Çalışmalar", href: ROUTES.FAALIYETLER },
    { title: "Dernek", href: ROUTES.UYELER },
    { title: "İletişim", href: ROUTES.ILETISIM },
  ];

  const [footerLinks, setFooterLinks] = useState(fallbackNavLinks);

  useEffect(() => {
    NavigationRepository.fetchNavFromDB("FOOTER", "visible").then((res) => {
      if (res && Array.isArray(res.footer) && res.footer.length > 0) {
        const mapped = res.footer.map((item: any) => {
          const rawSlug = item.page?.slug;
          const rawHref = item.href;
          let href = rawHref || "#";

          if (item.targetType === "PAGE" && rawSlug) {
            if (rawSlug === "hakkimizda") href = "/hakkimizda";
            else if (rawSlug === "katilim") href = "/katilim";
            else if (rawSlug === "iletisim") href = "/iletisim";
            else href = `/sayfa/${rawSlug}`;
          } else if (rawHref === "/sayfa/hakkimizda") {
            href = "/hakkimizda";
          } else if (rawHref === "/sayfa/katilim") {
            href = "/katilim";
          } else if (rawHref === "/sayfa/iletisim") {
            href = "/iletisim";
          }

          return {
            title: item.label,
            href,
          };
        });
        setFooterLinks(mapped);
      }
    });
  }, []);

  return (
    <footer className="w-full bg-white border-t border-[#EEF0F2] pt-10 pb-8 px-4 sm:px-6 lg:px-8 z-10 relative select-none font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 w-full">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 w-full">
          <div className="flex flex-col items-start space-y-3 max-w-xl min-w-0">
            <Link
              href={ROUTES.HOME}
              className="flex items-center outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/20 rounded-lg transition-transform hover:scale-105"
              aria-label="Ne Yapsak? Ana Sayfa"
            >
              <Logo variant="default" size={84} priority />
            </Link>

            <p className="text-xs sm:text-sm text-[#5F6773] leading-relaxed font-medium break-words">
              {language === "en"
                ? "Ne Yapsak? Youth Association aims to unleash youth potential, prepare them for the future, and provide opportunities for self-development across tech & creative domains."
                : "Ne Yapsak? Gençlik Derneği, gençlerin potansiyellerini ortaya çıkarmayı, onları geleceğe hazırlamayı ve farklı alanlarda kendilerini geliştirmelerine fırsat sunmayı amaçlayan bir gençlik derneğidir."}
            </p>

            <p className="text-xs sm:text-sm font-bold text-[#0A5C3A] italic font-headings tracking-tight">
              {language === "en"
                ? "Instead of saying 'I wish', take action by asking Ne Yapsak?"
                : "“Keşke” demeden, Ne Yapsak? diyerek harekete geç."}
            </p>
          </div>

          <nav aria-label="Footer Navigasyonu" className="w-full lg:w-auto">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-semibold">
              {footerLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-[#5F6773] hover:text-[#0A5C3A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A] rounded-md inline-block whitespace-nowrap"
                  >
                    {translateFooterTitle(link.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="w-full h-px bg-[#EEF0F2]" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F6773] font-medium text-center sm:text-left w-full">
          <p className="break-words">
            © {currentYear} Ne Yapsak? Gençlik Derneği. {t("footer.rights", "Tüm hakları saklıdır.")}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
            <Link
              href={ROUTES.KVKK}
              className="hover:text-[#0A5C3A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A] rounded-sm whitespace-nowrap"
            >
              {t("footer.kvkk", "KVKK Aydınlatma Metni")}
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link
              href={ROUTES.CEREZ_POLITIKASI}
              className="hover:text-[#0A5C3A] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C3A] rounded-sm whitespace-nowrap"
            >
              {t("footer.cookies", "Çerez Politikası")}
            </Link>
            <span className="hidden sm:inline">•</span>
            <p className="text-[#0A5C3A] font-semibold whitespace-nowrap">
              {language === "en" ? "With youth, into the future." : "Gençlerle birlikte, geleceğe."}
            </p>
          </div>
        </div>
      </div>
    </footer>

  );
};

Footer.displayName = "Footer";
