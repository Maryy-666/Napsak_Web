export interface PositionApplication {
  id: number;
  userId: number;
  positionId: number;
  phone?: string | null;
  school?: string | null;
  department?: string | null;
  cvUrl?: string | null;
  whyApply?: string | null;
  experience?: string | null;
  customAnswers?: any;
  status: "NEW" | "IN_REVIEW" | "INTERVIEW" | "ACCEPTED" | "REJECTED";
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
  position?: {
    id: number;
    title: string;
    team: string;
    workType?: string;
    location?: string;
  };
}

export interface CreatePositionApplicationPayload {
  positionId: number;
  phone?: string;
  school?: string;
  department?: string;
  cvUrl?: string;
  whyApply?: string;
  experience?: string;
  customAnswers?: any;
  name?: string;
  email?: string;
}

export const PositionApplicationsRepository = {
  async createApplication(payload: CreatePositionApplicationPayload): Promise<{
    success: boolean;
    error?: string;
    alreadyApplied?: boolean;
    application?: PositionApplication;
  }> {
    try {
      const res = await fetch("/api/position-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.error || "Başvuru gönderilemedi.",
          alreadyApplied: data.alreadyApplied,
        };
      }
      return { success: true, application: data.application };
    } catch (error: any) {
      return { success: false, error: "Sunucu ile bağlantı kurulamadı." };
    }
  },

  async fetchMyApplications(): Promise<PositionApplication[]> {
    try {
      const res = await fetch("/api/position-applications/my", { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async fetchAllApplications(params?: { positionId?: string; status?: string }): Promise<PositionApplication[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.positionId && params.positionId !== "all") queryParams.set("positionId", params.positionId);
      if (params?.status && params.status !== "all") queryParams.set("status", params.status);

      const url = `/api/position-applications${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async updateStatus(
    id: number,
    status: "NEW" | "IN_REVIEW" | "INTERVIEW" | "ACCEPTED" | "REJECTED",
    adminNote?: string | null
  ): Promise<{ success: boolean; error?: string; application?: PositionApplication }> {
    try {
      const res = await fetch(`/api/position-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Güncelleme başarısız." };
      }
      return { success: true, application: data.application };
    } catch {
      return { success: false, error: "Sunucu ile bağlantı kurulamadı." };
    }
  },

  async deleteApplication(id: number): Promise<boolean> {
    try {
      const res = await fetch(`/api/position-applications/${id}`, { method: "DELETE" });
      return res.ok;
    } catch {
      return false;
    }
  },
};
