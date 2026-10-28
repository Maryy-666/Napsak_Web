import { getAuthToken } from "./memberAuth";

export interface PageItem {
  id: number;
  slug: string;
  title: string;
  shortDescription?: string | null;
  content: string;
  publicationStatus: "PUBLISHED" | "DRAFT" | "ARCHIVED" | string;
  isFeatured: boolean;
  showInMenu: boolean;
  displayOrder: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return `http://${host}:3001`;
  }
  return (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001");
};

export const PagesRepository = {
  async fetchPagesFromDB(statusFilter: string = "published"): Promise<PageItem[]> {
    try {
      const token = typeof window !== "undefined" ? getAuthToken() : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = `${getApiBaseUrl()}/pages${statusFilter ? `?status=${statusFilter}` : ""}`;
      const res = await fetch(url, {
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Sayfalar yüklenemedi. HTTP ${res.status}`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE") {
        throw err;
      }
      console.error("PagesRepository.fetchPagesFromDB hatası:", err);
      return [];
    }
  },

  async fetchPageBySlugFromDB(slug: string): Promise<PageItem | null> {
    try {
      const token = typeof window !== "undefined" ? getAuthToken() : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${getApiBaseUrl()}/pages/${encodeURIComponent(slug)}`, {
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        return null;
      }

      return await res.json();
    } catch (err) {
      if ((err as any)?.digest === "DYNAMIC_SERVER_USAGE") {
        throw err;
      }
      console.error(`PagesRepository.fetchPageBySlugFromDB(${slug}) hatası:`, err);
      return null;
    }
  },

  async addPage(pageData: Partial<PageItem>): Promise<PageItem> {
    const token = getAuthToken();
    const res = await fetch(`${getApiBaseUrl()}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify(pageData),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Sayfa oluşturulamadı.");
    }

    return await res.json();
  },

  async updatePage(id: number, pageData: Partial<PageItem>): Promise<PageItem> {
    const token = getAuthToken();
    const res = await fetch(`${getApiBaseUrl()}/pages/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify(pageData),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Sayfa güncellenemedi.");
    }

    return await res.json();
  },

  async deletePage(id: number): Promise<boolean> {
    const token = getAuthToken();
    const res = await fetch(`${getApiBaseUrl()}/pages/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Sayfa silinemedi.");
    }

    return true;
  },
};
