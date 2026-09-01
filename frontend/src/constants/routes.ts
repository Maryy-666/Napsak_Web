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
  ADMIN: "/admin",
  BASVURU: "/basvuru",
  EKIPLER: "/ekipler",
  UYELER: "/uyeler",
  HABERLER: "/haberler",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  PROFIL: "/profil",
  KAYIT: "/kayit",
  BIZDEN_HABERDAR_OL: "/bizden-haberdar-ol",
  ACIK_POZISYONLAR: "/acik-pozisyonlar",
} as const;


export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

