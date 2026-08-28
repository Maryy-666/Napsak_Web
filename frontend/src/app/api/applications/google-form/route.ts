import { NextResponse } from "next/server";
import { ApplicationsRepository } from "@/lib/applicationsStore";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const fullName =
      body.fullName ||
      body.name ||
      body["Ad Soyad"] ||
      body["Adınız Soyadınız"] ||
      "Google Form Ziyaretçisi / Adayı";

    const email =
      body.email || body["E-posta"] || body["E-posta Adresiniz"] || "-";

    const phone =
      body.phone || body["Telefon"] || body["Telefon Numarası"] || "-";

    const program =
      body.program ||
      body["Ekip"] ||
      body["Tercih Edilen Ekip"] ||
      "Google Form Başvurusu";

    const city = body.city || body["Şehir"] || "";
    const school = body.school || body["Okul"] || body["Üniversite"] || "";
    const department = body.department || body["Bölüm"] || "";
    const grade = body.grade || body["Sınıf"] || "";
    const note =
      body.note ||
      body["Not"] ||
      body["Ön Yazı"] ||
      "Google Form yönlendirmesi veya yanıtı ile iletildi.";

    const newApp = await ApplicationsRepository.addApplication({
      fullName,
      email,
      phone,
      program: program.includes("Google Form") ? program : `${program} (Google Form)`,
      city,
      school,
      department,
      grade,
      note,
    });

    return NextResponse.json({
      success: true,
      message: "Google Form başvurusu başarıyla alındı ve yönetici paneline işlendi.",
      data: newApp,
    });
  } catch (error) {
    console.error("Google Form webhook error:", error);
    return NextResponse.json({ success: false, error: "Hata oluştu." }, { status: 500 });
  }
}
