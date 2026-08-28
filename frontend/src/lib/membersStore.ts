"use client";

import { PublicMember, PUBLIC_MEMBERS } from "../data/members";
import { getAuthToken } from "./memberAuth";

let cachedMembers: PublicMember[] = [];

export const MembersRepository = {
  getMembers(): PublicMember[] {
    if (cachedMembers.length > 0) return cachedMembers;
    return PUBLIC_MEMBERS;
  },

  async fetchMembersFromDB(): Promise<PublicMember[]> {
    try {
      const res = await fetch("/api/members", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          cachedMembers = json.data;
          return cachedMembers;
        }
      }
    } catch (err) {
      console.warn("DB'den üyeler alınamadı, yedek depolama kullanılıyor:", err);
    }
    if (cachedMembers.length === 0) {
      cachedMembers = PUBLIC_MEMBERS;
    }
    return cachedMembers;
  },

  async addMember(member: Omit<PublicMember, "id">): Promise<PublicMember> {
    const newMember: PublicMember = {
      ...member,
      id: `m-${Date.now()}`,
    };
    if (cachedMembers.length === 0) {
      cachedMembers = [...PUBLIC_MEMBERS];
    }
    cachedMembers.unshift(newMember);

    try {
      const token = typeof window !== "undefined" ? getAuthToken() : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch("/api/members", {
        method: "POST",
        headers,
        body: JSON.stringify(newMember),
      });
      await this.fetchMembersFromDB();
    } catch (err) {
      console.error("Üye eklenirken API hatası:", err);
    }

    return newMember;
  },

  async updateMember(id: string, updatedFields: Partial<PublicMember>): Promise<PublicMember | null> {
    if (cachedMembers.length === 0) {
      cachedMembers = [...PUBLIC_MEMBERS];
    }
    const index = cachedMembers.findIndex((m) => m.id === id);
    if (index !== -1) {
      cachedMembers[index] = { ...cachedMembers[index], ...updatedFields };

      try {
        const token = typeof window !== "undefined" ? getAuthToken() : null;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        await fetch(`/api/members/${id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(updatedFields),
        });
        await this.fetchMembersFromDB();
      } catch (err) {
        console.error("Üye güncellenirken API hatası:", err);
      }

      return cachedMembers[index];
    }
    return null;
  },

  async deleteMember(id: string): Promise<boolean> {
    if (cachedMembers.length === 0) {
      cachedMembers = [...PUBLIC_MEMBERS];
    }

    // Immediately filter out deleted member from in-memory cache
    cachedMembers = cachedMembers.filter((m) => m.id !== id && m.memberProfileId?.toString() !== id);

    try {
      const token = typeof window !== "undefined" ? getAuthToken() : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/members/${id}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        await this.fetchMembersFromDB();
        // Re-apply filter in case DB returned static fallback
        cachedMembers = cachedMembers.filter((m) => m.id !== id && m.memberProfileId?.toString() !== id);
      }
    } catch (err) {
      console.error("Üye silinirken API hatası:", err);
    }

    return true;
  },
};
