"use client";

import { getAuthToken } from "./memberAuth";

export interface PartnerItem {
  id: number;
  slug: string;
  name: string;
  nameEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  logo?: string | null;
  websiteUrl?: string | null;
  category: string;
  categoryEn?: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export const PartnersRepository = {
  async fetchPartnersFromDB(status?: string): Promise<PartnerItem[]> {
    try {
      const url = status ? `/api/partners?status=${status}` : "/api/partners";
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
      console.warn("DB'den paydaşlar alınamadı:", err);
    }
    return [];
  },

  async fetchPartnerBySlugOrId(idOrSlug: string): Promise<PartnerItem | null> {
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/partners/${idOrSlug}`, { cache: "no-store", headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn("Paydaş detayı alınamadı:", err);
    }
    return null;
  },

  async createPartner(data: Partial<PartnerItem>): Promise<PartnerItem> {
    const token = getAuthToken();
    const res = await fetch("/api/partners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Paydaş oluşturulamadı.");
    }
    return json.data;
  },

  async updatePartner(id: number, data: Partial<PartnerItem>): Promise<PartnerItem> {
    const token = getAuthToken();
    const res = await fetch(`/api/partners/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Paydaş güncellenemedi.");
    }
    return json.data;
  },

  async deletePartner(id: number): Promise<boolean> {
    const token = getAuthToken();
    const res = await fetch(`/api/partners/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Paydaş silinemedi.");
    }
    return true;
  },
};
