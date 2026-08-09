import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { TokenStoreService } from "../../../../lib/tokenStore";
import { UserRepositoryService } from "../../../../lib/userStore";

/**
 * GET Handler: Validates token status immediately for the Reset Password page load.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false, reason: "INVALID" }, { status: 400 });
    }

    // TODO: Replace with Prisma repository - Query token from Database (prisma.passwordResetToken.findUnique)
    const validation = TokenStoreService.validateToken(token);

    if (!validation.valid) {
      return NextResponse.json({ valid: false, reason: validation.reason }, { status: 400 });
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("[VERIFY TOKEN API SERVER ERROR]", error);
    return NextResponse.json({ valid: false, reason: "INVALID" }, { status: 500 });
  }
}

/**
 * POST Handler: Resets the password if the token is valid.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, password, confirmPassword } = body;

    // Validate inputs
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Geçersiz istek. Doğrulama anahtarı zorunludur." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || !confirmPassword || typeof confirmPassword !== "string") {
      return NextResponse.json(
        { success: false, error: "Şifre alanları zorunludur." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Girdiğiniz şifreler uyuşmamaktadır." },
        { status: 400 }
      );
    }

    // Password strength rules verification
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecial) {
      return NextResponse.json(
        { success: false, error: "Şifre tüm güvenlik gereksinimlerini karşılamalıdır." },
        { status: 400 }
      );
    }

    // TODO: Replace with Prisma repository - Check token in Database
    const validation = TokenStoreService.validateToken(token);
    if (!validation.valid || !validation.email) {
      const errorMessage =
        validation.reason === "EXPIRED"
          ? "Bağlantının süresi dolmuş."
          : validation.reason === "USED"
          ? "Bu bağlantı daha önce kullanılmış."
          : "Geçersiz şifre sıfırlama bağlantısı.";

      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }

    const email = validation.email;

    // Hash new password with bcryptjs using 12 salt rounds
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // TODO: Replace with Prisma repository - Update user password in Database (prisma.user.update)
    const updateSuccess = await UserRepositoryService.updateUserPassword(email, hashedPassword);

    if (!updateSuccess) {
      return NextResponse.json(
        { success: false, error: "Kullanıcı hesabına ulaşılamadı." },
        { status: 404 }
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[AUTH DEVELOPMENT] Password reset successfully processed & updated in UserRepository for: ${email}`);
    }

    // TODO: Replace with Prisma repository - Mark token as used / delete in Database (prisma.passwordResetToken.update)
    TokenStoreService.markTokenAsUsed(token);

    return NextResponse.json({ success: true, message: "Şifreniz başarıyla güncellendi." }, { status: 200 });
  } catch (error) {
    console.error("[RESET PASSWORD API SERVER ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
