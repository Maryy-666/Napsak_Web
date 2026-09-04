import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function getAuthHeader(request: NextRequest): Record<string, string> {
  const cookieToken = cookies().get("session_token")?.value;
  const headerAuth = request.headers.get("authorization");
  const token = cookieToken || (headerAuth?.startsWith("Bearer ") ? headerAuth.substring(7) : headerAuth);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const targetUrl = `${BACKEND_URL}/position-applications${queryString ? `?${queryString}` : ""}`;

    const headers = getAuthHeader(request);

    const res = await fetch(targetUrl, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Başvurular getirilemedi." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[POSITION APPLICATIONS GET API ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Backend sunucusuna bağlanılamadı." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(request),
    };

    const res = await fetch(`${BACKEND_URL}/position-applications`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Başvuru oluşturulamadı.", alreadyApplied: data.alreadyApplied },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[POSITION APPLICATIONS POST API ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Backend sunucusuna bağlanılamadı." },
      { status: 500 }
    );
  }
}
