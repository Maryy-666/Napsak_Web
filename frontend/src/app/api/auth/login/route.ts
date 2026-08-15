import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçerli bir e-posta adresi zorunludur.",
        },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Şifre zorunludur.",
        },
        { status: 400 }
      );
    }

    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Giriş başarısız oldu.",
        },
        { status: response.status }
      );
    }

    if (!data.token) {
      console.error("[LOGIN API] Backend token döndürmedi.");

      return NextResponse.json(
        {
          success: false,
          error: "Oturum oluşturulamadı.",
        },
        { status: 500 }
      );
    }

    const nextResponse = NextResponse.json({
      success: true,
      message: data.message || "Giriş başarılı.",
      user: data.user,
    });

    // Session token'ını güvenli cookie olarak sakla
    nextResponse.cookies.set("session_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(data.expiresAt),
    });

    return nextResponse;
  } catch (error) {
    console.error("[LOGIN API ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Backend sunucusuna bağlanılamadı.",
      },
      { status: 500 }
    );
  }
}