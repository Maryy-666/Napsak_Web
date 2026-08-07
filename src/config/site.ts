import { ROUTES } from "../constants/routes";

export const SITE_CONFIG = {
  name: "N'apsak? Gençlik Topluluğu",
  description: "Üreten, öğrenen ve birlikte gelişen gençlerin teknoloji topluluğu.",
  url: "https://napsak.com",
  mainNav: [
    {
      title: "Hakkımızda",
      href: ROUTES.HAKKIMIZDA,
    },
    {
      title: "Ekipler",
      href: ROUTES.EKIPLER,
    },
    {
      title: "Etkinlikler",
      href: ROUTES.ETKINLIKLER,
    },
    {
      title: "Blog",
      href: ROUTES.BLOG,
    },
    {
      title: "İletişim",
      href: ROUTES.ILETISIM,
    },
  ],
} as const;

export type SiteConfig = typeof SITE_CONFIG;
export type NavItem = typeof SITE_CONFIG.mainNav[number];
