import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const DEFAULT_MAGAZINES = [
  {
    id: "sayi-4-genclik-ve-gelecek",
    title: "N'apsak? Dergi Sayı #4 - Gençlik, Dijital Üretim ve Geleceğin Meslekleri",
    publishDate: "05 Ocak 2026",
    pages: 56,
    readCount: 2410,
    downloadCount: 890,
    coverImage: "/images/hero-community.jpg",
  },
  {
    id: "sayi-3-sanat-ve-toplum",
    title: "N'apsak? Dergi Sayı #3 - Yerel Sanat, Kamusal Alan ve Genç Ekspresyonu",
    publishDate: "15 Ekim 2025",
    pages: 48,
    readCount: 1750,
    downloadCount: 540,
    coverImage: "/images/news-kil-cover.jpg",
  },
  {
    id: "sayi-2-cevre-ve-iklim",
    title: "N'apsak? Dergi Sayı #2 - Ekolojik Dönüşüm ve Genç İklim Aktivizmi",
    publishDate: "20 Temmuz 2025",
    pages: 40,
    readCount: 1420,
    downloadCount: 480,
    coverImage: "/images/news-ani-cover.jpg",
  },
  {
    id: "sayi-1-ilk-adim",
    title: "N'apsak? Dergi Sayı #1 - Tanışma ve Kuruluş Özel Sayısı",
    publishDate: "10 Mayıs 2025",
    pages: 32,
    readCount: 1100,
    downloadCount: 390,
    coverImage: "/images/news-kariyer-cover.jpg",
  },
];

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/magazines`, { cache: "no-store" }).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch (err) {
    console.warn("Backend magazines endpoint error:", err);
  }

  return NextResponse.json({
    success: true,
    data: DEFAULT_MAGAZINES,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/magazines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("API /magazines POST error:", err);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
