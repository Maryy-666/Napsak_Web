import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_MEMBERS, PublicMember } from "@/data/members";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

let inMemoryMembers: PublicMember[] = [...PUBLIC_MEMBERS];

function mergeMembers(dbMembers: PublicMember[]) {
  const byId = new Map(PUBLIC_MEMBERS.map((member) => [member.id, member]));
  for (const member of dbMembers) {
    byId.set(member.id, member);
  }
  return Array.from(byId.values());
}

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

    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authHeader) headers["authorization"] = authHeader;

    const res = await fetch(`${BACKEND_URL}/members`, {
      method: "POST",
      headers,
      body: JSON.stringify(newMember),
    }).catch(() => null);

    if (res) {
      const json = await res.json().catch(() => ({}));
      if (res.ok) return NextResponse.json(json, { status: res.status });
    }

    inMemoryMembers.unshift(newMember);
    return NextResponse.json({ success: true, data: newMember, persisted: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Uye olusturulamadi." }, { status: 500 });
  }
}
