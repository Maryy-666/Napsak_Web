import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const DEFAULT_REPORTS = [
  {
    id: "genclik-katilimi-2026",
    title: "2026 Gençlik Katılımı ve Üretim Kültürü Raporu",
    category: "Gençlik & Katılım",
    period: "2026",
    status: "Yayınlandı",
    featured: true,
    summary:
      "Dernek üyelerinin etkinlik, gönüllülük ve sivil katılım pratiklerini inceleyen kapsamlı alan araştırması.",
    highlights: ["Katılım Motivasyonları", "Dijital Üretim Araçları", "Dernek Dinamikleri"],
    pages: 42,
    fileSize: "4.8 MB",
    publishDate: "12 Şubat 2026",
    readCount: 1840,
    downloadCount: 620,
    keyTakeaways: [
      "Katılımcıların %78'i pratik proje üretimi sunan atölyeleri tercih ediyor.",
      "Disiplinler arası ekiplerde proje tamamlama oranı %40 daha yüksek.",
      "Gençlerin en çok ihtiyaç duyduğu unsur sürdürülebilir mentorluk desteği.",
    ],
    tableOfContents: [
      "1. Giriş ve Araştırmanın Amacı",
      "2. Metodoloji ve Örneklem Profili",
      "3. Gençlik Katılım Trendleri ve Alan Bulguları",
      "4. Çalışma Ekiplerinin Üretim Analizleri",
      "5. Sonuç, Değerlendirme ve Gelecek Projeksiyonu",
    ],
    methodology:
      "Ne Yapsak? Gençlik Derneği bünyesindeki 450+ aktif üye ile gerçekleştirilen nicel anketler ve 24 odak grup görüşmesi analiz edilmiştir.",
  },
  {
    id: "calisma-ekipleri-2026-q1",
    title: "Çalışma Ekipleri Faaliyet ve Etki Notu",
    category: "Çalışma Ekipleri",
    period: "2026",
    status: "Yayınlandı",
    summary:
      "Teknoloji, sanat, çevre-sağlık, eğitim ve iletişim çalışma ekiplerinin ilk çeyrek üretim çıktıları.",
    highlights: ["5 Aktif Ekip", "14 Tamamlanan Proje", "Ekip İçi Sinerji"],
    pages: 28,
    fileSize: "3.1 MB",
    publishDate: "28 Ocak 2026",
    readCount: 950,
    downloadCount: 310,
    keyTakeaways: [
      "Teknoloji ekibi açık kaynak 3 yeni dernek aracını yayına aldı.",
      "Çevre & Sağlık ekibi 2 yerel farkındalık kampanyası tamamladı.",
    ],
    tableOfContents: [
      "1. Dönem Özeti",
      "2. Ekip Bazlı Çıktılar",
      "3. Gelecek Çeyrek Hedefleri",
    ],
    methodology:
      "Eş zamanlı proje takip araçları ve ekip liderlerinin dönemsel raporlamalarından derlenmiştir.",
  },
  {
    id: "etkinlik-geribildirim-2026",
    title: "Etkinlik & Atölye Geri Bildirimleri Analizi",
    category: "Etkinlik & Buluşmalar",
    period: "2026",
    status: "Hazırlanıyor",
    summary:
      "Gerçekleştirilen atölyeler ve buluşmalardan toplanan nitel/nicel geri bildirimlerin memnuniyet analizi.",
    highlights: ["Memnuniyet Oranları", "İçerik Önerileri"],
    pages: 18,
    fileSize: "2.2 MB",
    publishDate: "Mart 2026",
    readCount: 420,
    downloadCount: 0,
    keyTakeaways: [
      "Atölyelerde interaktif pratik süresinin artırılması talebi ön planda.",
      "Fiziki buluşmalara katılım motivasyonu ağ kurma odaklı.",
    ],
    tableOfContents: [
      "1. Etkinlik Katılımcı Profili",
      "2. Genel Memnuniyet İndeksi",
    ],
    methodology: "Etkinlik sonrasında iletilen dijital geri bildirim formları verilerinden derlenmektedir.",
  },
  {
    id: "yerel-genclik-ihtiyaclari-2026",
    title: "Yerel Gençlik İhtiyaçları & Saha Gözlemi",
    category: "Saha Araştırmaları",
    period: "2026",
    status: "Hazırlanıyor",
    summary:
      "Gençlerin öğrenme, sosyalleşme ve imkanlara erişim alanlarında karşılaştığı temel kısıtlar ve yerel ihtiyaç tespiti.",
    highlights: ["Mekansal İhtiyaçlar", "Öğrenme Ortamları"],
    pages: 36,
    fileSize: "4.0 MB",
    publishDate: "Nisan 2026",
    readCount: 290,
    downloadCount: 0,
    keyTakeaways: [
      "Gençlerin %65'i ücretsiz ve donanımlı ortak çalışma mekanlarına erişimde zorluk yaşıyor.",
    ],
    tableOfContents: [
      "1. Bölgesel Saha Çalışmaları",
      "2. Çözüm Önerileri ve Politika Notu",
    ],
    methodology: "Saha ziyaretleri ve yüz yüze mülakat teknikleri kullanılmaktadır.",
  },
];

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/reports`, { cache: "no-store" }).catch(() => null);

    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json({ success: true, data });
      }
    }
  } catch (err) {
    console.warn("Backend reports endpoint error:", err);
  }

  return NextResponse.json({
    success: true,
    data: DEFAULT_REPORTS,
  });
}
