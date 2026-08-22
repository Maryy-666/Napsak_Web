"use client";

import { getAuthToken } from "./memberAuth";

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  summary?: string | null;
  content: string;
  coverImage?: string | null;
  category?: string | null;
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

export const NewsRepository = {
  async fetchNewsFromDB(status?: string): Promise<NewsItem[]> {
    try {
      const url = status ? `/api/news?status=${status}` : "/api/news";
      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(url, { cache: "no-store", headers });
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
      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/news/${slug}`, { cache: "no-store", headers });
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
    const token = getAuthToken();
    const res = await fetch("/api/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    const token = getAuthToken();
    const res = await fetch(`/api/news/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    const token = getAuthToken();
    const res = await fetch(`/api/news/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Haber silinemedi.");
    }
    return true;
  },
};
