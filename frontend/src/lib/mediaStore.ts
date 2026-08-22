import { getAuthToken } from "./memberAuth";

export interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText?: string | null;
  title?: string | null;
  width?: number | null;
  height?: number | null;
  folder: string;
  storageKey?: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaListResponse {
  media: MediaItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    return `http://${host}:3001`;
  }
  return "http://localhost:3001";
};

export const MediaRepository = {
  async fetchMediaFromDB(params?: {
    page?: number;
    limit?: number;
    q?: string;
    folder?: string;
    type?: string;
  }): Promise<MediaListResponse> {
    try {
      const token = typeof window !== "undefined" ? getAuthToken() : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set("page", String(params.page));
      if (params?.limit) queryParams.set("limit", String(params.limit));
      if (params?.q) queryParams.set("q", params.q);
      if (params?.folder) queryParams.set("folder", params.folder);
      if (params?.type) queryParams.set("type", params.type);

      const url = `${getApiBaseUrl()}/media?${queryParams.toString()}`;
      const res = await fetch(url, { headers, cache: "no-store" });

      if (!res.ok) {
        throw new Error(`Medya yüklenemedi. HTTP ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error("MediaRepository.fetchMediaFromDB hatası:", err);
      return { media: [], pagination: { total: 0, page: 1, limit: 24, totalPages: 1 } };
    }
  },

  async uploadMedia(file: File, folder: string = "general", title?: string, altText?: string): Promise<MediaItem> {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    if (title) formData.append("title", title);
    if (altText) formData.append("altText", altText);

    const res = await fetch(`${getApiBaseUrl()}/media/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Dosya yüklenemedi.");
    }

    return await res.json();
  },

  async updateMedia(id: number, data: { title?: string; altText?: string; folder?: string }): Promise<MediaItem> {
    const token = getAuthToken();
    const res = await fetch(`${getApiBaseUrl()}/media/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Medya bilgileri güncellenemedi.");
    }

    return await res.json();
  },

  async deleteMedia(id: number): Promise<boolean> {
    const token = getAuthToken();
    const res = await fetch(`${getApiBaseUrl()}/media/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errorObj: any = new Error(errData.message || "Medya silinemedi.");
      if (errData.usageDetails) {
        errorObj.usageDetails = errData.usageDetails;
      }
      throw errorObj;
    }

    return true;
  },
};
