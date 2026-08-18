import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seed işlemi başladı...");

  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const userPassword = await bcrypt.hash("User123!", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@napsak.com",
    },
    update: {},
    create: {
      name: "N'apsak Admin",
      email: "admin@napsak.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: {
      email: "test@napsak.com",
    },
    update: {},
    create: {
      name: "Test Kullanıcı",
      email: "test@napsak.com",
      passwordHash: userPassword,
      role: "USER",
    },
  });

  const event = await prisma.event.create({
    data: {
      title: "N'apsak Tanışma Etkinliği",
      description: "N'apsak Gençlik Topluluğu tanışma etkinliği.",
      location: "Kocaeli",
      startDate: new Date("2026-09-01T18:00:00"),
      endDate: new Date("2026-09-01T20:00:00"),
    },
  });

  const message = await prisma.message.create({
    data: {
      name: "Test Ziyaretçi",
      email: "ziyaretci@example.com",
      subject: "Merhaba",
      content: "Bu bir test mesajıdır.",
    },
  });

  await prisma.application.create({
    data: {
      userId: user.id,
      program: "Teknoloji Programı",
      status: "PENDING",
    },
  });

  console.log("Seed başarıyla tamamlandı!");
  console.log("Admin:", admin.email);
  console.log("Kullanıcı:", user.email);
  console.log("Etkinlik:", event.title);
  console.log("Mesaj:", message.subject);
}

main()
  .catch((error) => {
    console.error("Seed sırasında hata oluştu:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
