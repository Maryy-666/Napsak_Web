import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const DEMO_TEST_PARTNERS = [
  {
    id: 1,
    slug: "demo-egitim-kurumu",
    name: "Demo Eğitim Kurumu",
    nameEn: "Demo Educational Institution",
    description: "[DEMO / TEST] Gençlere yönelik e-öğrenme ve dijital içerik desteği sağlayan örnek eğitim kuruluşu.",
    descriptionEn: "[DEMO / TEST] Sample educational institution providing e-learning and digital content support.",
    logo: "/images/sanat-kolaj.jpg",
    websiteUrl: "https://example.edu",
    category: "Eğitim",
    categoryEn: "Education",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: 2,
    slug: "napsak-test-paydasi",
    name: "N'apsak Test Paydaşı",
    nameEn: "N'apsak Test Partner",
    description: "[DEMO / TEST] Saha çalışmaları ve sosyal etki projelerinde ortak üretim gerçekleştirdiğimiz test paydaşımız.",
    descriptionEn: "[DEMO / TEST] Test partner with whom we collaborate on field research and social impact projects.",
    logo: "/images/pngtree-vibrant-earth-planet-surrounded-by-fresh-green-leaves-eco-friendly-concept-image_21673995.webp",
    websiteUrl: "https://example.org",
    category: "Paydaş",
    categoryEn: "Partner",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: 3,
    slug: "ornek-teknoloji-destekcisi",
    name: "Örnek Teknoloji Destekçisi",
    nameEn: "Sample Technology Supporter",
    description: "[DEMO / TEST] Yazılım altyapısı ve açık kaynak araç geliştirme süreçlerimize teknik katkı sunan örnek destekçi.",
    descriptionEn: "[DEMO / TEST] Sample supporter contributing technical expertise to our software and open-source tooling.",
    logo: "/images/istockphoto-1173149385-612x612.jpg",
    websiteUrl: "https://example.com",
    category: "Destekçi",
    categoryEn: "Supporter",
    isActive: true,
    displayOrder: 3,
  },
  {
    id: 4,
    slug: "demo-genclik-platformu",
    name: "Demo Gençlik Platformu",
    nameEn: "Demo Youth Platform",
    description: "[DEMO / TEST] Gençlik zirveleri, atölyeler ve topluluk buluşmalarında birlikte hareket ettiğimiz test platformu.",
    descriptionEn: "[DEMO / TEST] Test platform with whom we co-organize youth summits, workshops, and meetups.",
    logo: "/images/cevre-ve-saglik.png",
    websiteUrl: "https://example.net",
    category: "İş Birliği",
    categoryEn: "Collaboration",
    isActive: true,
    displayOrder: 4,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const targetUrl = `${BACKEND_URL}/partners${queryString ? `?${queryString}` : ""}`;

    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = {};
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(targetUrl, {
      headers,
      cache: "no-store",
    }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        return NextResponse.json(data);
      }
    }
  } catch (error) {
    console.warn("[PARTNERS GET API ERROR - Using Demo Fallback]", error);
  }

  // Safe fallback if Express backend is offline during local dev
  return NextResponse.json({
    success: true,
    data: DEMO_TEST_PARTNERS,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(`${BACKEND_URL}/partners`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Paydaş oluşturulamadı." },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[PARTNERS POST API ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Backend sunucusuna bağlanılamadı." },
      { status: 500 }
    );
  }
}
