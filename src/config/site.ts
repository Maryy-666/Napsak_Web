import { ROUTES } from "../constants/routes";

export const SITE_CONFIG = {
  name: "N'apsak? Gençlik Topluluğu",
  description: "Üreten, öğrenen ve birlikte gelişen gençlerin teknoloji topluluğu.",
  url: "https://napsak.com",
  contact: {
    email: "",
  },
  social: {
    instagram: "https://www.instagram.com/napsak_genclik_toplulugu?igsh=Z3R3aW4wMjFzdDBy",
    linkedin: "https://www.linkedin.com/company/napsakgen%C3%A7lik/",
  },
  mainNav: [
    {
      title: "İletişim",
      href: ROUTES.ILETISIM,
    },
    {
      title: "Topluluğa Katıl",
      href: ROUTES.BASVURU,
    },
  ],
} as const;

export type SiteConfig = typeof SITE_CONFIG;
export type NavItem = typeof SITE_CONFIG.mainNav[number];
