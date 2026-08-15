import { Router } from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import {
  authenticate,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth.js";

const router = Router();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Tüm başvuruları getir - SADECE ADMIN
router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(applications);
  } catch (error) {
    console.error("APPLICATION GET ERROR:", error);

    res.status(500).json({
      error: "Başvurular getirilemedi.",
    });
  }
});

// Yeni başvuru oluştur - GİRİŞ YAPMIŞ USER/ADMIN
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { program } = req.body;

    if (!program) {
      return res.status(400).json({
        error: "program zorunludur.",
      });
    }

    const application = await prisma.application.create({
      data: {
        userId: req.user!.id,
        program,
      },
    });

    res.status(201).json({
      message: "Başvuru başarıyla oluşturuldu.",
      application,
    });
  } catch (error) {
    console.error("APPLICATION POST ERROR:", error);

    res.status(500).json({
      error: "Başvuru oluşturulurken hata oluştu.",
    });
  }
});

// Başvuru durumunu güncelle - SADECE ADMIN
router.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          error: "Geçersiz başvuru ID'si.",
        });
      }

      if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
        return res.status(400).json({
          error: "Geçersiz başvuru durumu.",
        });
      }

      const application = await prisma.application.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

      res.json({
        message: "Başvuru durumu güncellendi.",
        application,
      });
    } catch (error) {
      console.error("APPLICATION STATUS ERROR:", error);

      res.status(500).json({
        error: "Başvuru durumu güncellenemedi.",
      });
    }
  }
);

// Başvuru sil - SADECE ADMIN
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          error: "Geçersiz başvuru ID'si.",
        });
      }

      await prisma.application.delete({
        where: {
          id,
        },
      });

      res.json({
        message: "Başvuru başarıyla silindi.",
      });
    } catch (error) {
      console.error("APPLICATION DELETE ERROR:", error);

      res.status(500).json({
        error: "Başvuru silinemedi.",
      });
    }
  }
);

export default router;