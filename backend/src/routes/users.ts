import { Router } from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";

const router = Router();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Tüm kullanıcıları getir
router.get("/", async (req, res) => {
  try {
    console.log("USERS API ÇALIŞTI");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log("KULLANICILAR:", users);

    res.json(users);
  } catch (error) {
    console.error("USERS API HATASI:", error);

    res.status(500).json({
      error: "Kullanıcılar alınamadı.",
    });
  }
});

// ID'ye göre kullanıcı getir
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Geçersiz kullanıcı ID'si.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Kullanıcı bulunamadı.",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("USER ID API HATASI:", error);

    res.status(500).json({
      error: "Kullanıcı alınamadı.",
    });
  }
});

export default router;