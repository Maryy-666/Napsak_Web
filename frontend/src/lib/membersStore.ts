"use client";

import { PublicMember, PUBLIC_MEMBERS } from "../data/members";

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
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          cachedMembers = json.data;
          return cachedMembers;
        }
      }
    } catch (err) {
      console.warn("DB'den üyeler alınamadı, yedek depolama kullanılıyor:", err);
    }
    cachedMembers = PUBLIC_MEMBERS;
    return cachedMembers;
  },

  async addMember(member: Omit<PublicMember, "id">): Promise<PublicMember> {
    const newMember: PublicMember = {
      ...member,
      id: `m-${Date.now()}`,
    };
    cachedMembers.unshift(newMember);

    try {
      await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
      await this.fetchMembersFromDB();
    } catch (err) {
      console.error("Üye eklenirken API hatası:", err);
    }

    return newMember;
  },

  async updateMember(id: string, updatedFields: Partial<PublicMember>): Promise<PublicMember | null> {
    const index = cachedMembers.findIndex((m) => m.id === id);
    if (index !== -1) {
      cachedMembers[index] = { ...cachedMembers[index], ...updatedFields };

      try {
        await fetch(`/api/members/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
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
    const index = cachedMembers.findIndex((m) => m.id === id);
    if (index !== -1) {
      cachedMembers.splice(index, 1);

      try {
        await fetch(`/api/members/${id}`, {
          method: "DELETE",
        });
        await this.fetchMembersFromDB();
      } catch (err) {
        console.error("Üye silinirken API hatası:", err);
      }

      return true;
    }
    return false;
  },
};
