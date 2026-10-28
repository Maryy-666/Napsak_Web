import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    const response = await fetch(
      `${BACKEND_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("[FORGOT PASSWORD API ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Şifre sıfırlama işlemi sırasında hata oluştu.",
      },
      { status: 500 }
    );
  }
}