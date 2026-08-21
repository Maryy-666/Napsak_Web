import { Router } from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Tüm kullanıcıları getir - SADECE ADMIN
router.get("/", authenticate, requireAdmin, async (req, res) => {
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

// ID'ye göre kullanıcı getir - SADECE ADMIN
router.get("/:id", authenticate, requireAdmin, async (req, res) => {
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

// Kullanıcı rolünü değiştir - SADECE ADMIN
router.patch("/:id/role", authenticate, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { role } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Geçersiz kullanıcı ID'si.",
      });
    }

    if (role !== "USER" && role !== "ADMIN") {
      return res.status(400).json({
        error: "Geçersiz rol.",
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("ROLE UPDATE HATASI:", error);

    res.status(500).json({
      error: "Kullanıcı rolü güncellenemedi.",
    });
  }
});

// Kullanıcı sil - SADECE ADMIN (ADMIN rollü kullanıcılar silinemez)
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Geçersiz kullanıcı ID'si." });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    if (targetUser.role === "ADMIN" || targetUser.email.toLowerCase() === "admin@napsak.com") {
      return res.status(403).json({ error: "Yönetici (ADMIN) hesapları güvenlik nedeniyle silinemez!" });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: "Kullanıcı başarıyla silindi." });
  } catch (error) {
    console.error("USER DELETE API HATASI:", error);
    res.status(500).json({ error: "Kullanıcı silinemedi." });
  }
});

export default router;