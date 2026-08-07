import { NextRequest, NextResponse } from "next/server";
import { UserRepositoryService } from "../../../../lib/userStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    // Validate request body input parameters
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Geçerli bir e-posta adresi zorunludur." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length === 0) {
      return NextResponse.json(
        { success: false, error: "Şifre zorunludur." },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // TODO: Replace with Prisma repository - Find user by email in Database (prisma.user.findUnique)
    const user = UserRepositoryService.findUserByEmail(sanitizedEmail);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Geçersiz e-posta veya şifre." },
        { status: 401 }
      );
    }

    // TODO: Replace with Prisma repository - Verify bcrypt password hash against DB record
    const isPasswordValid = await UserRepositoryService.verifyPassword(sanitizedEmail, password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Geçersiz e-posta veya şifre." },
        { status: 401 }
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[AUTH DEVELOPMENT] Successful login for user: ${sanitizedEmail}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Giriş başarılı.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[LOGIN API SERVER ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
