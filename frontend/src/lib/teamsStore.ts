"use client";

import { TEAMS_DATA, TeamData } from "../data/teams";

let cachedTeams: TeamData[] = [];

export const TeamsRepository = {
  getTeams(): TeamData[] {
    if (cachedTeams.length > 0) return cachedTeams;
    return TEAMS_DATA;
  },

  async fetchTeamsFromDB(): Promise<TeamData[]> {
    try {
      const res = await fetch("/api/teams", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          cachedTeams = json.data;
          return cachedTeams;
        }
      }
    } catch (err) {
      console.warn("DB'den ekipler alınamadı, varsayılan depo kullanılıyor:", err);
    }
    cachedTeams = TEAMS_DATA;
    return cachedTeams;
  },

  async addTeam(team: Omit<TeamData, "id">): Promise<TeamData> {
    const newTeam: TeamData = {
      ...team,
      id: team.slug || `team-${Date.now()}`,
    };
    cachedTeams.push(newTeam);

    try {
      await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam),
      });
      await this.fetchTeamsFromDB();
    } catch (err) {
      console.error("Ekip eklenirken API hatası:", err);
    }

    return newTeam;
  },

  async updateTeam(id: string, updatedFields: Partial<TeamData>): Promise<TeamData | null> {
    const index = cachedTeams.findIndex((t) => t.id === id || t.slug === id);
    if (index !== -1) {
      cachedTeams[index] = { ...cachedTeams[index], ...updatedFields };

      try {
        await fetch(`/api/teams/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        });
        await this.fetchTeamsFromDB();
      } catch (err) {
        console.error("Ekip güncellenirken API hatası:", err);
      }

      return cachedTeams[index];
    }
    return null;
  },

  async deleteTeam(id: string): Promise<boolean> {
    const index = cachedTeams.findIndex((t) => t.id === id || t.slug === id);
    if (index !== -1) {
      cachedTeams.splice(index, 1);

      try {
        await fetch(`/api/teams/${id}`, {
          method: "DELETE",
        });
        await this.fetchTeamsFromDB();
      } catch (err) {
        console.error("Ekip silinirken API hatası:", err);
      }

      return true;
    }
    return false;
  },
};
