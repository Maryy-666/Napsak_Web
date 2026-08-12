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
  city: string;
  school: string;
  department: string;
  grade: string;
  bio: string;
  skills: string;
  cv?: {
    name: string;
    size: number;
    uploadedAt: string;
  };
}

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
    city: "",
    school: "",
    department: "",
    grade: "",
    bio: "",
    skills: "",
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
}
