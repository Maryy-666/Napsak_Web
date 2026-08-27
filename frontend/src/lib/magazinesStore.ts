"use client";

import { getAuthToken } from "./memberAuth";

export interface MagazineItem {
  id: number;
  slug?: string;
  title: string;
  issueNumber?: string | null;
  description?: string | null;
  pages: number;
  publishDate?: string | null;
  readCount: number;
  pdfUrl?: string | null;
  coverImage?: string | null;
  publicationStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export const MagazinesRepository = {
  async fetchMagazinesFromDB(status?: string): Promise<MagazineItem[]> {
    try {
      const url = status ? `/api/magazines?status=${status}` : "/api/magazines";
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
      console.warn("DB'den dergiler alınamadı:", err);
    }
    return [];
  },

  async fetchMagazineBySlug(slug: string): Promise<MagazineItem | null> {
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/magazines/${slug}`, { cache: "no-store", headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn("Dergi detayı alınamadı:", err);
    }
    return null;
  },

  async createMagazine(data: Partial<MagazineItem>): Promise<MagazineItem> {
    const token = getAuthToken();
    const res = await fetch("/api/magazines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Dergi oluşturulamadı.");
    }
    return json.data;
  },

  async updateMagazine(id: number, data: Partial<MagazineItem>): Promise<MagazineItem> {
    const token = getAuthToken();
    const res = await fetch(`/api/magazines/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Dergi güncellenemedi.");
    }
    return json.data;
  },

  async deleteMagazine(id: number): Promise<boolean> {
    const token = getAuthToken();
    const res = await fetch(`/api/magazines/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Dergi silinemedi.");
    }
    return true;
  },
};
