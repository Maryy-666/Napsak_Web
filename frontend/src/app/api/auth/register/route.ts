import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let email: unknown;
  let password: unknown;
  let name: unknown;

  try {
    const body = await request.json().catch(() => ({}));
    name = body.name;
    email = body.email;
    password = body.password;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Ad ve soyad zorunludur.",
        },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçerli bir e-posta adresi zorunludur.",
        },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Şifre en az 8 karakter olmalıdır.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Backend Express /auth/register endpoint'ine istek gönder
    const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: (name as string).trim(),
        email: normalizedEmail,
        password,
      }),
    });

    const registerData = await registerResponse.json().catch(() => ({}));

    if (!registerResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: registerData.error || "Kayıt oluşturulamadı.",
        },
        { status: registerResponse.status }
      );
    }

    // 2. Kayıt sonrası otomatik oturum açmak için backend /auth/login çağrısı yap
    const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
      }),
    });

    const loginData = await loginResponse.json().catch(() => ({}));

    const nextResponse = NextResponse.json({
      success: true,
      message: registerData.message || "Kullanıcı başarıyla oluşturuldu.",
      user: registerData.user || loginData.user,
    });

    // Oturum token'ı varsa güvenli HTTP-only cookie'ye ekle
    if (loginResponse.ok && loginData.token) {
      nextResponse.cookies.set("session_token", loginData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(loginData.expiresAt),
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("[REGISTER API ERROR]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Backend sunucusuna bağlanılamadı. Lütfen tekrar deneyiniz.",
      },
      { status: 500 }
    );
  }
}
