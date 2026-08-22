import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

const authHeaders = (request: NextRequest): HeadersInit => {
  const cookieToken = cookies().get("session_token")?.value;
  const forwardedAuth = request.headers.get("authorization");
  const token = cookieToken || forwardedAuth?.replace(/^Bearer\s+/i, "");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const targetUrl = `${BACKEND_URL}/news${status ? `?status=${encodeURIComponent(status)}` : ""}`;

  try {
    const response = await fetch(targetUrl, {
      cache: "no-store",
      headers: authHeaders(request),
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Haberler alınamadı." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(request),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Haber oluşturulamadı." },
      { status: 500 }
    );
  }
}
