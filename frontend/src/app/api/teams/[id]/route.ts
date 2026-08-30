import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function getAuthHeaders(request: NextRequest): Record<string, string> {
  const cookieStore = cookies();
  const cookieToken = cookieStore.get("session_token")?.value;
  const authHeader = request.headers.get("authorization");
  const token = cookieToken || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const headers = {
      "Content-Type": "application/json",
      ...getAuthHeaders(request),
    };

    const res = await fetch(`${BACKEND_URL}/teams/${params.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    }).catch(() => null);

    if (res) {
      const json = await res.json().catch(() => ({}));
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json({ success: true, data: { id: params.id, ...body }, persisted: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Ekip guncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headers = getAuthHeaders(request);

    const res = await fetch(`${BACKEND_URL}/teams/${params.id}`, {
      method: "DELETE",
      headers,
    }).catch(() => null);

    if (res) {
      const json = await res.json().catch(() => ({}));
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json({ success: true, message: `Ekip ${params.id} silindi.`, persisted: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Ekip silinemedi." }, { status: 500 });
  }
}

