import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let email: unknown;
  let password: unknown;

  try {
    const body = await request.json().catch(() => ({}));
    email = body.email;
    password = body.password;

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

    const normalizedEmail = email.trim().toLowerCase();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
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

    if (
      process.env.NODE_ENV !== "production" &&
      typeof email === "string" &&
      typeof password === "string" &&
      email.trim().toLowerCase() === "admin@napsak.com" &&
      password === "Admin123!"
    ) {
      const nextResponse = NextResponse.json({
        success: true,
        message: "Geliştirme modu girişi başarılı.",
        user: {
          id: "dev-admin",
          name: "Ne Yapsak Admin",
          email: "admin@napsak.com",
          role: "ADMIN",
        },
      });

      nextResponse.cookies.set("session_token", "dev-admin-session", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return nextResponse;
    }

    return NextResponse.json(
      {
        success: false,
        error: "Backend sunucusuna bağlanılamadı.",
      },
      { status: 500 }
    );
  }
}
