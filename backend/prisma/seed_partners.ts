import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const DEMO_TEST_PARTNERS = [
  {
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

async function main() {
  console.log("🌱 Test Paydaşları Seed Başlıyor...");

  for (const partnerData of DEMO_TEST_PARTNERS) {
    await prisma.partner.upsert({
      where: { slug: partnerData.slug },
      update: { ...partnerData },
      create: { ...partnerData },
    });
  }

  console.log("✅ Test Paydaşları başarıyla veritabanına eklendi!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
