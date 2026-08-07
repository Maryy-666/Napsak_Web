import { NextRequest, NextResponse } from "next/server";
import { TokenStoreService } from "../../../../lib/tokenStore";
import { UserRepositoryService } from "../../../../lib/userStore";
import { sendPasswordResetEmail } from "../../../../lib/email";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate limiting: Max 5 requests per 15 minutes per IP
    if (TokenStoreService.isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin." },
        { status: 429 }
      );
    }
    TokenStoreService.incrementRequest(ip);

    const body = await request.json().catch(() => ({}));
    const { email } = body;

    // Email validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      // Return HTTP 200 with generic success to prevent email enumeration or timing leaks
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // TODO: Replace with Prisma repository - Find user by email in Database (prisma.user.findUnique)
    const user = UserRepositoryService.findUserByEmail(sanitizedEmail);

    // Only generate reset token and dispatch email if user actually exists
    if (user) {
      // Generate secure 32-byte hex token and store SHA-256 hash in tokenStore
      // TODO: Replace with Prisma repository - Save generated reset token to Database (prisma.passwordResetToken.create)
      const plainToken = TokenStoreService.generateAndSaveToken(user.email);

      // Determine application base URL
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin || `${protocol}://${host}` || "http://localhost:3000";

      const resetUrl = `${baseUrl}/reset-password/${plainToken}`;

      // Send email via Resend (or dev console fallback)
      const emailResult = await sendPasswordResetEmail({
        to: user.email,
        resetUrl,
      });

      if (!emailResult.success) {
        console.error(`[AUTH API ERROR] Failed to send password reset email to ${user.email}:`, emailResult.error);
      }
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[AUTH DEVELOPMENT] Password reset requested for unregistered email: ${sanitizedEmail}. (Pretending success for anti-enumeration)`);
      }
    }

    // Always return HTTP 200 { success: true } without revealing user existence or detailed status
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[FORGOT PASSWORD API SERVER ERROR]", error);
    // Always return generic client response for security
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
