import { NextRequest, NextResponse } from "next/server";
import { UserRepositoryService } from "../../../../lib/userStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Geçerli bir e-posta adresi zorunludur." },
        { status: 400 }
      );
    }

    const deleted = UserRepositoryService.deleteUserByEmail(email);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Hesap silinemedi." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Hesap silindi." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Hesap silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
