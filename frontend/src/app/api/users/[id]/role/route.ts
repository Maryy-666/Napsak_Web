import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const cookieToken = cookieStore.get("session_token")?.value;
    const authHeader = request.headers.get("authorization");
    const token = cookieToken || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "Geçersiz oturum." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(
      `${BACKEND_URL}/users/${params.id}/role`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error || "Rol güncellenemedi.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[ROLE UPDATE API ERROR]", error);

    return NextResponse.json(
      { error: "Backend sunucusuna bağlanılamadı." },
      { status: 500 }
    );
  }
}