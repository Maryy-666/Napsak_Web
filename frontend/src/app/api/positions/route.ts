import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const targetUrl = `${BACKEND_URL}/positions${queryString ? `?${queryString}` : ""}`;

    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(targetUrl, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Açık pozisyonlar getirilemedi." },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[POSITIONS GET API ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Backend sunucusuna bağlanılamadı." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(`${BACKEND_URL}/positions`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Pozisyon oluşturulamadı." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[POSITIONS POST API ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Backend sunucusuna bağlanılamadı." },
      { status: 500 }
    );
  }
}
