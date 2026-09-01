import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(`${BACKEND_URL}/positions/${params.id}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Pozisyon bulunamadı." },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[POSITIONS GET BY ID API ERROR]", error);
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
    const authHeader = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(`${BACKEND_URL}/positions/${params.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Pozisyon güncellenemedi." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[POSITIONS PATCH API ERROR]", error);
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
    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(`${BACKEND_URL}/positions/${params.id}`, {
      method: "DELETE",
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Pozisyon silinemedi." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[POSITIONS DELETE API ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Backend sunucusuna bağlanılamadı." },
      { status: 500 }
    );
  }
}
