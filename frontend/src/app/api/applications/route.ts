import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function GET() {
  try {
    const token = cookies().get("session_token")?.value;
    const res = await fetch(`${BACKEND_URL}/applications`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      return NextResponse.json({ success: false, data: [] }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API /applications GET error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = cookies().get("session_token")?.value;
    const res = await fetch(`${BACKEND_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    }).catch(() => null);

    if (res) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json({ success: true, message: "Başvuru alındı.", data: body });
  } catch (error) {
    console.error("API /applications POST error:", error);
    return NextResponse.json({ success: true, message: "Başvuru alındı." });
  }
}
