import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🔥 Veritabanı Seed işlemi başladı...");

  // 1. Şifreler
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const userPassword = await bcrypt.hash("User123!", 10);

  // 2. Kullanıcılar
  const admin = await prisma.user.upsert({
    where: { email: "admin@napsak.com" },
    update: {},
    create: {
      name: "N'apsak Admin",
      email: "admin@napsak.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "zeynep.yilmaz@gmail.com" },
    update: {},
    create: {
      name: "Zeynep Yılmaz",
      email: "zeynep.yilmaz@gmail.com",
      passwordHash: userPassword,
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "mehmet.demir@hotmail.com" },
    update: {},
    create: {
      name: "Mehmet Demir",
      email: "mehmet.demir@hotmail.com",
      passwordHash: userPassword,
      role: "USER",
    },
  });

  // 3. Üyelik Başvuruları
  await prisma.application.createMany({
    data: [
      {
        userId: user1.id,
        program: "Yazılım & Tasarım Ekibi",
        status: "PENDING",
      },
      {
        userId: user2.id,
        program: "Sosyal Medya & İçerik Ekibi",
        status: "APPROVED",
      },
    ],
  });

  // 4. Etkinlikler
  const event1 = await prisma.event.create({
    data: {
      title: "1923 Gençlik Topluluğu İş Birliği & Tanışma Zirvesi",
      description: "Gençlik ekosistemi ve projelerin ele alınacağı büyük tanışma etkinliği.",
      category: "Programlar & Sosyal",
      location: "Beylikdüzü Smart-B Kültür Merkezi",
      status: "Yaklaşan",
      capacity: 120,
      targetAudience: "Üniversite Öğrencileri",
      startDate: new Date("2026-09-15T14:00:00"),
      endDate: new Date("2026-09-15T18:00:00"),
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Kil Atölyesi: Çamurdan Hayallere",
      description: "Doğal kil ile sanatsal biçimlendirme ve el becerisi atölyesi.",
      category: "Sanat & Atölye",
      location: "Kültür Atölyesi",
      status: "Tamamlanan",
      capacity: 40,
      targetAudience: "Genç Sanatseverler",
      startDate: new Date("2026-08-01T10:00:00"),
      endDate: new Date("2026-08-01T13:00:00"),
    },
  });

  // 5. Etkinlik Başvuruları
  await prisma.eventApplication.createMany({
    data: [
      {
        eventId: event1.id,
        fullName: "Elif Kaya",
        email: "elif.kaya@outlook.com",
        phone: "0544 777 88 99",
        city: "İstanbul",
        school: "Ege Üniversitesi",
        department: "Psikoloji",
        grade: "4. Sınıf",
        note: "Etkinlikte organizasyon ekibinde destek olmak istiyorum.",
        status: "Onaylandı",
      },
      {
        eventId: event1.id,
        fullName: "Caner Arslan",
        email: "caner.arslan@gmail.com",
        phone: "0505 123 45 67",
        city: "Bursa",
        school: "Uludağ Üniversitesi",
        department: "İşletme",
        grade: "Mezun",
        note: "Zirveye katılım sağlamak istiyorum.",
        status: "Beklemede",
      },
    ],
  });

  // 6. Faaliyetler (Activities)
  await prisma.activity.createMany({
    data: [
      {
        type: "polaroid",
        title: "Kil Atölyesi: Çamurdan Hayallere",
        category: "Sanat & Atölye",
        team: "Sanat Ekibi",
        status: "Tamamlanan",
        date: "15 Ekim 2025",
        location: "Kültür Atölyesi",
        summary: "Gençlerimizin elleriyle şekil verdiği, el becerilerini ortaya çıkardığı doğal kil atölyemiz.",
        participantCount: 35,
        rotation: "-rotate-2",
        pinColor: "text-[#0A5C3A]",
      },
      {
        type: "polaroid",
        title: "Anı Defteri Atölyesi",
        category: "Tasarım & Üretim",
        team: "Tasarım Ekibi",
        status: "Tamamlanan",
        date: "12 Kasım 2025",
        location: "Gençlik Merkezi",
        summary: "Fotoğraflar ve el yazılarıyla kişiselleştirilen özel anı defteri tasarımı.",
        participantCount: 28,
        rotation: "rotate-2",
        pinColor: "text-[#0A5C3A]",
      },
    ],
  });

  // 7. Raporlar (Reports)
  await prisma.report.createMany({
    data: [
      {
        title: "2026 Gençlik Katılımı ve Üretim Kültürü Raporu",
      },
      {
        title: "2025 Sivil Toplum & Gençlik Ekosistemi Değerlendirmesi",
      },
    ],
  });

  // 8. Dergiler (Magazines)
  await prisma.magazine.createMany({
    data: [
      {
        title: "N'apsak? Dergi Sayı 01 - Gençlik & Gelecek",
      },
      {
        title: "N'apsak? Dergi Sayı 02 - Teknoloji & Sanat",
      },
    ],
  });

  // 9. Mesajlar (Messages)
  await prisma.message.createMany({
    data: [
      {
        name: "Ahmet Yıldız",
        email: "ahmet.yildiz@gmail.com",
        phone: "0533 999 88 77",
        subject: "Sponsorluk ve İş Birliği",
        category: "İş Birliği",
        content: "Topluluğunuzun önümüzdeki zirve projesinde sponsor olmak istiyoruz.",
        isRead: false,
      },
      {
        name: "Selin Şahin",
        email: "selin.sahin@hotmail.com",
        phone: "0542 555 11 22",
        subject: "Gönüllü Katılımı",
        category: "Genel",
        content: "Gönüllü ekibinize katılmak için detaylı bilgi alabilir miyim?",
        isRead: true,
      },
    ],
  });

  console.log("✅ Veritabanı örnek verilerle (Seed) başarıyla dolduruldu!");
}

main()
  .catch((error) => {
    console.error("❌ Seed sırasında hata oluştu:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
