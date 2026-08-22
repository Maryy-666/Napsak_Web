import { getAuthToken } from "./memberAuth";

export type NavTargetType = "PAGE" | "CUSTOM_URL" | "DROPDOWN_PARENT";
export type NavLocation = "NAVBAR" | "FOOTER" | "BOTH";

export interface NavItemData {
  id: number;
  label: string;
  targetType: NavTargetType | string;
  href?: string | null;
  pageId?: number | null;
  page?: {
    id: number;
    slug: string;
    title: string;
    publicationStatus?: string;
  } | null;
  parentId?: number | null;
  location: NavLocation | string;
  displayOrder: number;
  isVisible: boolean;
  openInNewTab: boolean;
  children?: NavItemData[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NavFetchResponse {
  all: NavItemData[];
  tree: NavItemData[];
  navbar: NavItemData[];
  footer: NavItemData[];
}

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return `http://${host}:3001`;
  }
  return "http://localhost:3001";
};

export const NavigationRepository = {
  async fetchNavFromDB(locationFilter?: string, statusFilter: string = "visible"): Promise<NavFetchResponse> {
    try {
      const token = typeof window !== "undefined" ? getAuthToken() : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const params = new URLSearchParams();
      if (locationFilter) params.append("location", locationFilter);
      if (statusFilter) params.append("status", statusFilter);

      const url = `${getApiBaseUrl()}/navigation?${params.toString()}`;
      const res = await fetch(url, {
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Menü yüklenemedi. HTTP ${res.status}`);
      }

      const data = await res.json();
      return {
        all: Array.isArray(data.all) ? data.all : [],
        tree: Array.isArray(data.tree) ? data.tree : [],
        navbar: Array.isArray(data.navbar) ? data.navbar : [],
        footer: Array.isArray(data.footer) ? data.footer : [],
      };
    } catch (err) {
      console.error("NavigationRepository.fetchNavFromDB hatası:", err);
      return { all: [], tree: [], navbar: [], footer: [] };
    }
  },

  async addNavItem(navData: Partial<NavItemData>): Promise<NavItemData> {
    const token = getAuthToken();
    const res = await fetch(`${getApiBaseUrl()}/navigation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify(navData),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Menü öğesi oluşturulamadı.");
    }

    return await res.json();
  },

  async updateNavItem(id: number, navData: Partial<NavItemData>): Promise<NavItemData> {
    const token = getAuthToken();
    const res = await fetch(`${getApiBaseUrl()}/navigation/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify(navData),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Menü öğesi güncellenemedi.");
    }

    return await res.json();
  },

  async deleteNavItem(id: number): Promise<boolean> {
    const token = getAuthToken();
    const res = await fetch(`${getApiBaseUrl()}/navigation/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Menü öğesi silinemedi.");
    }

    return true;
  },

  async reorderNavItems(items: Array<{ id: number; displayOrder: number }>): Promise<boolean> {
    const token = getAuthToken();
    const res = await fetch(`${getApiBaseUrl()}/navigation/reorder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Menü sıralaması kaydedilemedi.");
    }

    return true;
  },
};
