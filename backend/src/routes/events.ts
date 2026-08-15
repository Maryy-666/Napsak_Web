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

// Tüm etkinlikleri getir - HERKES
router.get("/", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        startDate: "asc",
      },
    });

    res.json(events);
  } catch (error) {
    console.error("EVENTS GET ERROR:", error);

    res.status(500).json({
      error: "Etkinlikler getirilemedi.",
    });
  }
});

// Yeni etkinlik oluştur - SADECE ADMIN
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      startDate,
      endDate,
    } = req.body;

    if (!title || !startDate) {
      return res.status(400).json({
        error: "Başlık ve başlangıç tarihi zorunludur.",
      });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        location: location || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    res.status(201).json({
      message: "Etkinlik başarıyla oluşturuldu.",
      data: event,
    });
  } catch (error) {
    console.error("EVENTS POST ERROR:", error);

    res.status(500).json({
      error: "Etkinlik oluşturulamadı.",
    });
  }
});

// Etkinlik güncelle - SADECE ADMIN
router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          error: "Geçersiz etkinlik ID'si.",
        });
      }

      const {
        title,
        description,
        location,
        startDate,
        endDate,
      } = req.body;

      const event = await prisma.event.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(location !== undefined && { location }),
          ...(startDate !== undefined && {
            startDate: new Date(startDate),
          }),
          ...(endDate !== undefined && {
            endDate: endDate ? new Date(endDate) : null,
          }),
        },
      });

      res.json({
        message: "Etkinlik başarıyla güncellendi.",
        data: event,
      });
    } catch (error) {
      console.error("EVENTS PATCH ERROR:", error);

      res.status(500).json({
        error: "Etkinlik güncellenemedi.",
      });
    }
  }
);

// Etkinlik sil - SADECE ADMIN
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          error: "Geçersiz etkinlik ID'si.",
        });
      }

      await prisma.event.delete({
        where: { id },
      });

      res.json({
        message: "Etkinlik başarıyla silindi.",
      });
    } catch (error) {
      console.error("EVENTS DELETE ERROR:", error);

      res.status(500).json({
        error: "Etkinlik silinemedi.",
      });
    }
  }
);

export default router;