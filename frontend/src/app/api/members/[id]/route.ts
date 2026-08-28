import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authHeader) headers["authorization"] = authHeader;

    const res = await fetch(`${BACKEND_URL}/members/${params.id}`, {
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
    return NextResponse.json({ success: false, error: "Uye guncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = {};
    if (authHeader) headers["authorization"] = authHeader;

    const res = await fetch(`${BACKEND_URL}/members/${params.id}`, {
      method: "DELETE",
      headers,
    }).catch(() => null);

    if (res) {
      const json = await res.json().catch(() => ({}));
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json({ success: true, message: `Uye ${params.id} silindi.`, persisted: false });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Uye silinemedi." }, { status: 500 });
  }
}
