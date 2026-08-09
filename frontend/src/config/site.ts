import { ROUTES } from "../constants/routes";

export const SITE_CONFIG = {
  name: "N'apsak? Gençlik Topluluğu",
  slogan: "“Keşke..” diyenlerin değil, “N’apsak?” deyip harekete geçenlerin topluluğuyuz.",
  description:
    "N'apsak? Gençlik Topluluğu, gençlerin potansiyellerini ortaya çıkarmayı, onları geleceğe hazırlamayı ve farklı alanlarda kendilerini geliştirmelerine fırsat sunmayı amaçlayan bir gençlik topluluğudur.",
  url: "https://napsak.org",
  established: "2025",
  contact: {
    email: "kurumsal@napsak.org",
    phone: "0535 634 06 54",
  },
  social: {
    instagram: "https://www.instagram.com/napsakgencliktoplulugu",
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
