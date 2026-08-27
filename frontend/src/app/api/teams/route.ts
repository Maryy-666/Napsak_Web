import { NextRequest, NextResponse } from "next/server";
import { TEAMS_DATA, TeamData } from "@/data/teams";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

let inMemoryTeams: TeamData[] = [...TEAMS_DATA];

function mergeTeams(dbTeams: TeamData[]) {
  const byId = new Map(TEAMS_DATA.map((team) => [team.id, team]));
  for (const team of dbTeams) {
    byId.set(team.id, team);
  }
  return Array.from(byId.values());
}

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/teams`, { cache: "no-store" }).catch(() => null);

    if (res && res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return NextResponse.json({ success: true, data: mergeTeams(json.data) });
      }
    }
  } catch (error) {
    console.warn("Backend teams endpoint okunamadi, yedek depo kullaniliyor:", error);
  }

  return NextResponse.json({ success: true, data: inMemoryTeams });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTeam: TeamData = {
      id: body.id || body.slug || `team-${Date.now()}`,
      slug: body.slug || `team-${Date.now()}`,
      title: body.title || "Yeni Ekip",
      shortDescription: body.shortDescription || "Ekip aciklamasi.",
      about: body.about || "Ekip hakkinda detayli bilgi.",
      iconName: body.iconName || "cpu",
      bgImage: body.bgImage || "/images/istockphoto-1173149385-612x612.jpg",
      focusAreas: body.focusAreas || ["Genel"],
      whatWeDo: body.whatWeDo || ["Calismalar"],
      structure: body.structure || "Esnek calisma modeli",
      featuredSectionImage: body.featuredSectionImage,
      galleryTitle: body.galleryTitle,
      gallery: body.gallery,
    };

    const res = await fetch(`${BACKEND_URL}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTeam),
    }).catch(() => null);

    if (res) {
      const json = await res.json().catch(() => ({}));
      if (res.ok) return NextResponse.json(json, { status: res.status });
    }

    inMemoryTeams.push(newTeam);
    return NextResponse.json({ success: true, data: newTeam, persisted: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Ekip olusturulamadi." }, { status: 500 });
  }
}
