import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { removeInMemoryMember, updateInMemoryMember } from "@/lib/inMemoryMembersStore";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function getAuthHeaders(request: NextRequest): Record<string, string> {
  const cookieStore = cookies();
  const cookieToken = cookieStore.get("session_token")?.value;
  const authHeader = request.headers.get("authorization");
  const token = cookieToken || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader);

  const headers: Record<string, string> = {};
  if (token) {
    headers["authorization"] = `Bearer ${token}`;
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

    const res = await fetch(`${BACKEND_URL}/members/${params.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    }).catch(() => null);

    if (res) {
      const json = await res.json().catch(() => ({}));
      return NextResponse.json(json, { status: res.status });
    }

    updateInMemoryMember(params.id, body);
    return NextResponse.json({ success: true, data: { id: params.id, ...body }, persisted: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Uye guncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const headers = getAuthHeaders(request);

    const res = await fetch(`${BACKEND_URL}/members/${params.id}`, {
      method: "DELETE",
      headers,
    }).catch(() => null);

    if (res) {
      const json = await res.json().catch(() => ({}));
      return NextResponse.json(json, { status: res.status });
    }

    removeInMemoryMember(params.id);
    return NextResponse.json({ success: true, message: "Silindi (in-memory)" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Uye silinemedi." }, { status: 500 });
  }
}

