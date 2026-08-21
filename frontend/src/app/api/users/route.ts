import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const DEFAULT_USERS = [
  {
    id: 1,
    name: "N'apsak Admin",
    email: "admin@napsak.com",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Zeynep Yılmaz",
    email: "zeynep.yilmaz@gmail.com",
    role: "USER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Mehmet Demir",
    email: "mehmet.demir@hotmail.com",
    role: "USER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Elif Kaya",
    email: "elif.kaya@outlook.com",
    role: "USER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("session_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}/users`, {
      method: "GET",
      headers,
      cache: "no-store",
    }).catch(() => null);

    if (response && response.ok) {
      const data = await response.json().catch(() => null);
      if (data) {
        return NextResponse.json(data);
      }
    }
  } catch (error) {
    console.error("[USERS API ERROR]", error);
  }

  // Fallback if backend is offline or unauthenticated in dev
  return NextResponse.json({
    success: true,
    data: DEFAULT_USERS,
  });
}