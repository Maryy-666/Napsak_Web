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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headers = getAuthHeader(request);

    const res = await fetch(`${BACKEND_URL}/position-applications/${params.id}`, {
      headers,
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Başvuru getirilemedi." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[POSITION APPLICATION GET ID ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Backend sunucusuna bağlanılamadı." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeader(request),
    };

    const res = await fetch(`${BACKEND_URL}/position-applications/${params.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Başvuru güncellenemedi." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[POSITION APPLICATION PATCH ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Backend sunucusuna bağlanılamadı." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headers = getAuthHeader(request);

    const res = await fetch(`${BACKEND_URL}/position-applications/${params.id}`, {
      method: "DELETE",
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Başvuru silinemedi." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[POSITION APPLICATION DELETE ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Backend sunucusuna bağlanılamadı." },
      { status: 500 }
    );
  }
}
