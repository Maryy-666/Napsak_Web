import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const token = cookies().get("session_token")?.value;
    const res = await fetch(`${BACKEND_URL}/applications/${params.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("API /applications/[id] PATCH error:", error);
    return NextResponse.json({ error: "Güncelleme hatası." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get("session_token")?.value;
    const res = await fetch(`${BACKEND_URL}/applications/${params.id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("API /applications/[id] DELETE error:", error);
    return NextResponse.json({ error: "Silme hatası." }, { status: 500 });
  }
}
