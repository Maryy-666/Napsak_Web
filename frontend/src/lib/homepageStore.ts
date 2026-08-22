"use client";

import { getAuthToken } from "./memberAuth";

export interface HomepageHeroItem {
  id: number;
  badge?: string | null;
  title: string;
  highlightText?: string | null;
  description: string;
  primaryCtaText?: string | null;
  primaryCtaLink?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const HomepageRepository = {
  async fetchHeroSlidesFromDB(status?: string): Promise<HomepageHeroItem[]> {
    try {
      const url = status ? `/api/homepage/hero?status=${status}` : "/api/homepage/hero";
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
      console.warn("DB'den hero slaytları alınamadı:", err);
    }
    return [];
  },

  async createHeroSlide(data: Partial<HomepageHeroItem>): Promise<HomepageHeroItem> {
    const token = getAuthToken();
    const res = await fetch("/api/homepage/hero", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Hero slaytı oluşturulamadı.");
    }
    return json.data;
  },

  async updateHeroSlide(id: number, data: Partial<HomepageHeroItem>): Promise<HomepageHeroItem> {
    const token = getAuthToken();
    const res = await fetch(`/api/homepage/hero/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Hero slaytı güncellenemedi.");
    }
    return json.data;
  },

  async deleteHeroSlide(id: number): Promise<boolean> {
    const token = getAuthToken();
    const res = await fetch(`/api/homepage/hero/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Hero slaytı silinemedi.");
    }
    return true;
  },

  async fetchSectionConfig<T>(key: string): Promise<T | null> {
    try {
      const res = await fetch(`/api/homepage/config/${key}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data as T;
        }
      }
    } catch (err) {
      console.warn(`DB'den ${key} ayarı alınamadı:`, err);
    }
    return null;
  },

  async saveSectionConfig(key: string, content: any): Promise<boolean> {
    const token = getAuthToken();
    const res = await fetch(`/api/homepage/config/${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(content),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Ayar kaydedilemedi.");
    }
    return true;
  },
};
