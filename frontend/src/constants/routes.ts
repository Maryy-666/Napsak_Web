export const ROUTES = {
  HOME: "/",
  HAKKIMIZDA: "/hakkimizda",
  ETKINLIKLER: "/etkinlikler",
  DERGILER: "/dergiler",
  RAPORLAR: "/raporlar",
  FAALIYETLER: "/faaliyetler",
  KATILIM: "/katilim",
  HARITA: "/harita",
  SSS: "/sss",
  KVKK: "/kvkk",
  CEREZ_POLITIKASI: "/cerez-politikasi",
  ILETISIM: "/iletisim",
  LOGIN: "/login",
  BASVURU: "/basvuru",
  EKIPLER: "/ekipler",
  HABERLER: "/haberler",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

