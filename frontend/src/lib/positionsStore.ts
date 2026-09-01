"use client";

import { getAuthToken } from "./memberAuth";

export type WorkMode = "Gönüllü" | "Uzaktan" | "Hibrit" | "Yüz Yüze";

export interface OpenPosition {
  id: number;
  slug: string;
  title: string;
  titleEn?: string | null;
  team: string;
  teamEn?: string | null;
  teamCategory: "iletisim" | "teknoloji" | "etkinlik" | "yonetim" | "diger" | string;
  shortDescription: string;
  shortDescriptionEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  responsibilities: string[];
  responsibilitiesEn: string[];
  requirements: string[];
  requirementsEn: string[];
  preferredQualifications: string[];
  preferredQualificationsEn: string[];
  workType: string;
  workTypeEn?: string | null;
  location: string;
  locationEn?: string | null;
  isActive: boolean;
  isUrgent: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export const PositionsRepository = {
  async fetchPositionsFromDB(status?: string): Promise<OpenPosition[]> {
    try {
      const url = status ? `/api/positions?status=${status}` : "/api/positions";
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
      console.warn("DB'den pozisyonlar alınamadı:", err);
    }
    return [];
  },

  async fetchPositionBySlugOrId(idOrSlug: string): Promise<OpenPosition | null> {
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/positions/${idOrSlug}`, { cache: "no-store", headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn("Pozisyon detayı alınamadı:", err);
    }
    return null;
  },

  async createPosition(data: Partial<OpenPosition>): Promise<OpenPosition> {
    const token = getAuthToken();
    const res = await fetch("/api/positions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Pozisyon oluşturulamadı.");
    }
    return json.data;
  },

  async updatePosition(id: number, data: Partial<OpenPosition>): Promise<OpenPosition> {
    const token = getAuthToken();
    const res = await fetch(`/api/positions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Pozisyon güncellenemedi.");
    }
    return json.data;
  },

  async deletePosition(id: number): Promise<boolean> {
    const token = getAuthToken();
    const res = await fetch(`/api/positions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Pozisyon silinemedi.");
    }
    return true;
  },
};
