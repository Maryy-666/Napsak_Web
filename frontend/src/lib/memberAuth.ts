"use client";

export type MemberRole = "admin" | "member";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: MemberRole;
}

export interface MemberProfile {
  fullName: string;
  email: string;
  phone: string;
  birthDate?: string;
  linkedin?: string;
  city: string;
  university?: string;
  universityType?: string;
  school: string;
  department: string;
  grade: string;
  startDate?: string;
  graduationDate?: string;
  gpa?: string;
  experience?: string;
  interests?: string[];
  careerPreferences?: string[];
  bio: string;
  skills: string;
  avatar?: string;
  cv?: {
    name: string;
    size: number;
    uploadedAt: string;
  };
}

/**
 * SECURITY ARCHITECTURAL NOTICE:
 * Currently, session management (`SESSION_KEY`) uses client-side `localStorage`
 * for local state persistence and simulated auth state in this App Router setup.
 *
 * TODO (Backend Integration Requirement):
 * Upon full database and backend authentication integration (e.g. Prisma + NextAuth / JWT / Iron Session),
 * session tokens MUST be migrated exclusively to HttpOnly, Secure, SameSite cookies
 * rather than client-side `localStorage` to prevent token exposure via XSS vectors.
 */
const SESSION_KEY = "napsak_auth_user";
const profileKey = (email: string) => `napsak_member_profile_${email.toLowerCase()}`;

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: AuthUser) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getMemberProfile(user: AuthUser): MemberProfile {
  const fallback: MemberProfile = {
    fullName: user.name || "",
    email: user.email,
    phone: "",
    birthDate: "",
    linkedin: "",
    city: "",
    university: "",
    universityType: "",
    school: "",
    department: "",
    grade: "",
    startDate: "",
    graduationDate: "",
    gpa: "",
    experience: "",
    interests: [],
    careerPreferences: [],
    bio: "",
    skills: "",
    avatar: "",
  };

  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(profileKey(user.email));
    return raw ? { ...fallback, ...(JSON.parse(raw) as Partial<MemberProfile>) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveMemberProfile(user: AuthUser, profile: MemberProfile) {
  window.localStorage.setItem(profileKey(user.email), JSON.stringify(profile));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("profile-updated"));
  }
}
