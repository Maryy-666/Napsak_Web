import { NextRequest, NextResponse } from "next/server";
import { UserRepositoryService } from "../../../../lib/userStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, password, confirmPassword } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Ad soyad alanı zorunludur." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Geçerli bir e-posta adresi zorunludur." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Şifre en az 8 karakter olmalıdır." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Şifreler eşleşmiyor." },
        { status: 400 }
      );
    }

    const user = await UserRepositoryService.createMember({
      name,
      email,
      password,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Kayıt başarıyla oluşturuldu.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Kayıt oluşturulamadı." },
      { status: 400 }
    );
  }
}
