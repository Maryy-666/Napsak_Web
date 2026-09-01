import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PublicMember } from "@/data/members";
import { inMemoryMembers, addInMemoryMember } from "@/lib/inMemoryMembersStore";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/members`, { cache: "no-store" }).catch(() => null);

    if (res && res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return NextResponse.json({ success: true, data: json.data });
      }
    }
  } catch (error) {
    console.warn("Backend members endpoint okunamadi, yedek depo kullaniliyor:", error);
  }

  return NextResponse.json({ success: true, data: inMemoryMembers });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = body.name || "Yeni Uye";
    const newMember: PublicMember = {
      id: body.id || `m-${Date.now()}`,
      name,
      initials: body.initials || String(name).substring(0, 2).toUpperCase(),
      primaryTeam: body.primaryTeam || "Teknoloji Ekibi",
      primaryRole: body.primaryRole || "Uye",
      isPresident: Boolean(body.isPresident),
      memberships:
        body.memberships || [{ team: body.primaryTeam || "Teknoloji Ekibi", role: body.primaryRole || "Uye" }],
    };

    const cookieStore = cookies();
    const cookieToken = cookieStore.get("session_token")?.value;
    const authHeader = request.headers.get("authorization");
    const token = cookieToken || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader);

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BACKEND_URL}/members`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }).catch(() => null);

    if (res && res.ok) {
      const json = await res.json();
      return NextResponse.json(json);
    }

    addInMemoryMember(newMember);
    return NextResponse.json({ success: true, data: newMember });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Uye eklenemedi" }, { status: 500 });
  }
}


