import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const cookieStore = cookies();
    const cookieToken = cookieStore.get("session_token")?.value;
    const authHeader = request.headers.get("authorization");
    const token = cookieToken || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader);

    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}/users/${id}`, {
      method: "DELETE",
      headers,
    }).catch(() => null);

    if (response && !response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: data.error || "Kullanıcı silinemedi." },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: `Kullanıcı ${id} silindi.` });
  } catch (error) {
    console.error("[USER DELETE API ERROR]", error);
    return NextResponse.json({ success: false, error: "Backend sunucusuna bağlanılamadı." }, { status: 500 });
  }
}

