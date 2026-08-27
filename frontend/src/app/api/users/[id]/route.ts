import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const cookieStore = cookies();
    const token = cookieStore.get("session_token")?.value;

    const response = await fetch(`http://localhost:3001/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(() => null);

    if (response && !response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: data.error || "Kullanıcı silinemedi." },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: `Kullanıcı ${id} silindi.` });
  } catch (error) {
    console.error("[USER DELETE API ERROR]", error);
    return NextResponse.json({ success: false, error: "Backend sunucusuna bağlanılamadı." }, { status: 500 });
  }
}
