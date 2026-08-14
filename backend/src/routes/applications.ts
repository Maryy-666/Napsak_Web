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

// Tüm başvuruları getir
router.get("/", async (req, res) => {
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
      details: String(error),
    });
  }
});

// Yeni başvuru oluştur
router.post("/", async (req, res) => {
  try {
    const { userId, program } = req.body;

    if (!userId || !program) {
      return res.status(400).json({
        error: "userId ve program zorunludur.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Kullanıcı bulunamadı.",
      });
    }

    const application = await prisma.application.create({
      data: {
        userId: Number(userId),
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
      details: String(error),
    });
  }
});

// Başvuru durumunu güncelle
router.patch("/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

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
      details: String(error),
    });
  }
});

// Başvuru sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

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
      details: String(error),
    });
  }
});

export default router;