import { ROUTES } from "../constants/routes";

export type NavItemStatus = "active" | "coming-soon";

export interface NavItem {
  title: string;
  href: string;
  status: NavItemStatus;
  items?: NavItem[];
}

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
      title: "Ana Sayfa",
      href: ROUTES.HOME,
      status: "active",
    },
    {
      title: "Hakkımızda",
      href: ROUTES.HAKKIMIZDA,
      status: "active",
    },
    {
      title: "Etkinlikler",
      href: ROUTES.ETKINLIKLER,
      status: "active",
    },
    {
      title: "Çalışmalar",
      href: "#calismalar",
      status: "active",
      items: [
        {
          title: "Dergiler",
          href: ROUTES.DERGILER,
          status: "active",
        },
        {
          title: "Raporlar",
          href: ROUTES.RAPORLAR,
          status: "active",
        },
        {
          title: "Faaliyetler",
          href: ROUTES.FAALIYETLER,
          status: "active",
        },
      ],
    },
    {
      title: "Topluluk",
      href: "#topluluk",
      status: "active",
      items: [
        {
          title: "Çalışma Ekiplerimiz",
          href: ROUTES.EKIPLER,
          status: "active",
        },
        {
          title: "Ekibimiz",
          href: ROUTES.UYELER,
          status: "active",
        },
        {
          title: "Etkileşim / Katılım",
          href: ROUTES.KATILIM,
          status: "active",
        },
        {
          title: "SSS",
          href: ROUTES.SSS,
          status: "active",
        },
      ],
    },
    {
      title: "İletişim",
      href: ROUTES.ILETISIM,
      status: "active",
    },
  ] as NavItem[],
} as const;

export type SiteConfig = typeof SITE_CONFIG;
