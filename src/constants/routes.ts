export const ROUTES = {
  HOME: "/",
  HAKKIMIZDA: "/#hakkimizda",
  EKIPLER: "/ekipler",
  ETKINLIKLER: "/etkinlikler",
  BLOG: "/blog",
  ILETISIM: "/iletisim",
  LOGIN: "/login",
  BASVURU: "/basvuru",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
