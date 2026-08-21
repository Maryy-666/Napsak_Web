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

// Tüm mesajları getir - SADECE ADMIN
router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(messages);
  } catch (error) {
    console.error("MESSAGES GET ERROR:", error);

    res.status(500).json({
      error: "Mesajlar getirilemedi.",
    });
  }
});

// Yeni mesaj oluştur - HERKES
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, category, content } = req.body;

    if (!name || !email || !content) {
      return res.status(400).json({
        error: "Ad, email ve mesaj içeriği zorunludur.",
      });
    }

    const message = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        category: category || null,
        content,
      },
    });

    res.status(201).json({
      message: "Mesaj başarıyla gönderildi.",
      data: message,
    });
  } catch (error) {
    console.error("MESSAGES POST ERROR:", error);

    res.status(500).json({
      error: "Mesaj gönderilemedi.",
    });
  }
});

// Mesajı okundu olarak işaretle - SADECE ADMIN
router.patch(
  "/:id/read",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          error: "Geçersiz mesaj ID'si.",
        });
      }

      const message = await prisma.message.update({
        where: { id },
        data: {
          isRead: true,
        },
      });

      res.json({
        message: "Mesaj okundu olarak işaretlendi.",
        data: message,
      });
    } catch (error) {
      console.error("MESSAGES READ ERROR:", error);

      res.status(500).json({
        error: "Mesaj güncellenemedi.",
      });
    }
  }
);

// Mesajı sil - SADECE ADMIN
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          error: "Geçersiz mesaj ID'si.",
        });
      }

      await prisma.message.delete({
        where: { id },
      });

      res.json({
        message: "Mesaj başarıyla silindi.",
      });
    } catch (error) {
      console.error("MESSAGES DELETE ERROR:", error);

      res.status(500).json({
        error: "Mesaj silinemedi.",
      });
    }
  }
);

export default router;
