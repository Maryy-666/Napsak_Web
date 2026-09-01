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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json().catch(() => ({}));
    const authHeader = getAuthHeader(request);

    const res = await fetch(`${BACKEND_URL}/homepage/hero/${id}`, {
      method: "PATCH",
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
      { success: false, error: "Hero slaytı güncellenemedi." },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const authHeader = getAuthHeader(request);

    const res = await fetch(`${BACKEND_URL}/homepage/hero/${id}`, {
      method: "DELETE",
      headers: {
        ...authHeader,
      },
    }).catch(() => null);

    if (res) {
      const json = await res.json().catch(() => ({}));
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json(
      { success: false, error: "Hero slaytı silinemedi." },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
