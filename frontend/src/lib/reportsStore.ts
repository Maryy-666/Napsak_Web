"use client";

import { getAuthToken } from "./memberAuth";

export interface ReportItem {
  id: number;
  slug?: string;
  title: string;
  category?: string | null;
  summary?: string | null;
  description?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  pdfUrl?: string | null;
  coverImage?: string | null;
  readCount: number;
  downloadCount: number;
  publishDate?: string | null;
  publicationStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export const ReportsRepository = {
  async fetchReportsFromDB(status?: string): Promise<ReportItem[]> {
    try {
      const url = status ? `/api/reports?status=${status}` : "/api/reports";
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
      console.warn("DB'den raporlar alınamadı:", err);
    }
    return [];
  },

  async fetchReportBySlug(slug: string): Promise<ReportItem | null> {
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/reports/${slug}`, { cache: "no-store", headers });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn("Rapor detayı alınamadı:", err);
    }
    return null;
  },

  async createReport(data: Partial<ReportItem>): Promise<ReportItem> {
    const token = getAuthToken();
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Rapor oluşturulamadı.");
    }
    return json.data;
  },

  async updateReport(id: number, data: Partial<ReportItem>): Promise<ReportItem> {
    const token = getAuthToken();
    const res = await fetch(`/api/reports/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Rapor güncellenemedi.");
    }
    return json.data;
  },

  async deleteReport(id: number): Promise<boolean> {
    const token = getAuthToken();
    const res = await fetch(`/api/reports/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Rapor silinemedi.");
    }
    return true;
  },
};
