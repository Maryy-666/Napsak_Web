import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:3001";

function getAuthHeader(request: NextRequest): Record<string, string> {
  const cookieToken = cookies().get("session_token")?.value;
  const headerAuth = request.headers.get("authorization");
  const token = cookieToken || (headerAuth?.startsWith("Bearer ") ? headerAuth.substring(7) : headerAuth);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const targetUrl = `${BACKEND_URL}/homepage/hero${status ? `?status=${encodeURIComponent(status)}` : ""}`;
    const authHeader = getAuthHeader(request);

    const res = await fetch(targetUrl, {
      cache: "no-store",
      headers: {
        ...authHeader,
      },
    }).catch(() => null);

    if (res) {
      const json = await res.json().catch(() => ({}));
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json(
      { success: false, error: "Hero slaytları getirilemedi." },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const authHeader = getAuthHeader(request);

    const res = await fetch(`${BACKEND_URL}/homepage/hero`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(body),
    }).catch(() => null);

    if (res) {
      const json = await res.json().catch(() => ({}));
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json(
      { success: false, error: "Hero slaytı oluşturulamadı." },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
