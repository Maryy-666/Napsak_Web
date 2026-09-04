"use client";

import { getAuthToken } from "./memberAuth";

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  titleEn?: string | null;
  summary?: string | null;
  summaryEn?: string | null;
  content: string;
  contentEn?: string | null;
  coverImage?: string | null;
  category?: string | null;
  categoryEn?: string | null;
  excerptEn?: string | null;
  publishDate?: string | null;
  readTime?: string | null;
  publicationStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  displayOrder: number;
  quoteText?: string | null;
  quoteAuthor?: string | null;
  quoteTitle?: string | null;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const NewsRepository = {
  async fetchNewsFromDB(status?: string): Promise<NewsItem[]> {
    try {
      const url = status ? `/api/news?status=${encodeURIComponent(status)}` : "/api/news";

      const res = await fetch(url, {
        cache: "no-store",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn("DB'den haberler alınamadı:", err);
    }
    return [];
  },

  async fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
    try {
      const res = await fetch(`/api/news/${encodeURIComponent(slug)}`, {
        cache: "no-store",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn("Haber detayı alınamadı:", err);
    }
    return null;
  },

  async createNews(data: Partial<NewsItem>): Promise<NewsItem> {
    const res = await fetch("/api/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Haber oluşturulamadı.");
    }
    return json.data;
  },

  async updateNews(id: number, data: Partial<NewsItem>): Promise<NewsItem> {
    const res = await fetch(`/api/news/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Haber güncellenemedi.");
    }
    return json.data;
  },

  async deleteNews(id: number): Promise<boolean> {
    const res = await fetch(`/api/news/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Haber silinemedi.");
    }
    return true;
  },
};
