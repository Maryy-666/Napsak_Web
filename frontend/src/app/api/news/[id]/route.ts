import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

const authHeaders = (request: NextRequest): HeadersInit => {
  const cookieToken = cookies().get("session_token")?.value;
  const forwardedAuth = request.headers.get("authorization");
  const token = cookieToken || forwardedAuth?.replace(/^Bearer\s+/i, "");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const response = await fetch(`${BACKEND_URL}/news/${encodeURIComponent(params.id)}`, {
      cache: "no-store",
      headers: authHeaders(request),
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Haber detayı alınamadı." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/news/${encodeURIComponent(params.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(request),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Haber güncellenemedi." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const response = await fetch(`${BACKEND_URL}/news/${encodeURIComponent(params.id)}`, {
      method: "DELETE",
      headers: authHeaders(request),
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Haber silinemedi." },
      { status: 500 }
    );
  }
}
