import { TeamData, TEAMS_DATA } from "../data/teams";

const TEAM_STORE_KEY = "napsak_teams";
const TEAM_STORE_EVENT = "napsak-teams-updated";

export function getStoredTeams(): TeamData[] {
  if (typeof window === "undefined") return TEAMS_DATA;

  try {
    const raw = window.localStorage.getItem(TEAM_STORE_KEY);
    return raw ? (JSON.parse(raw) as TeamData[]) : TEAMS_DATA;
  } catch {
    return TEAMS_DATA;
  }
}

export function saveStoredTeams(teams: TeamData[]) {
  window.localStorage.setItem(TEAM_STORE_KEY, JSON.stringify(teams));
  window.dispatchEvent(new Event(TEAM_STORE_EVENT));
}

export function getStoredTeamBySlug(slug: string): TeamData | undefined {
  const normalizedSlug = slug.toLowerCase().trim();
  return getStoredTeams().find((team) => team.slug === normalizedSlug || team.id === normalizedSlug);
}

export function subscribeToTeamUpdates(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === TEAM_STORE_KEY) callback();
  };

  window.addEventListener(TEAM_STORE_EVENT, callback);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(TEAM_STORE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}
