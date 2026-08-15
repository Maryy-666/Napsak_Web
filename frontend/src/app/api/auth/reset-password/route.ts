import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:3001";

/**
 * GET Handler:
 * Reset Password sayfası açıldığında tokenın geçerli olup olmadığını
 * backend'e sorar.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, reason: "INVALID" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/auth/reset-password?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("[RESET PASSWORD VERIFY API ERROR]", error);

    return NextResponse.json(
      {
        valid: false,
        reason: "INVALID",
      },
      { status: 500 }
    );
  }
}

/**
 * POST Handler:
 * Yeni şifreyi backend'e gönderir.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const response = await fetch(
      `${BACKEND_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("[RESET PASSWORD API ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Şifre sıfırlama sırasında hata oluştu.",
      },
      { status: 500 }
    );
  }
}