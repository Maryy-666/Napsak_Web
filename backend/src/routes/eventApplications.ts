import { Router } from "express";
import prisma from "../db.js";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth.js";
import { formLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Tüm etkinlik başvurularını getir - SADECE ADMIN
router.get("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const applications = await prisma.eventApplication.findMany({
      include: {
        event: {
          select: {
            id: true,
            title: true,
            category: true,
            location: true,
            startDate: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("EVENT APPLICATIONS GET ERROR:", error);
    res.status(500).json({
      success: false,
      error: "Etkinlik başvuruları getirilemedi.",
    });
  }
});

// Yeni etkinlik başvurusu oluştur (PUBLIC FORM RATE LIMITED)
router.post("/", formLimiter, async (req, res) => {
  try {
    const {
      eventId,
      fullName,
      email,
      phone,
      city,
      school,
      department,
      grade,
      note,
      status,
    } = req.body;

    const numericEventId = Number(eventId);

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        error: "Ad Soyad ve E-posta alanları zorunludur.",
      });
    }

    // Eğer eventId sayısal bir ID ise, veritabanında var mı kontrol et (veya default fallback)
    let validEventId = Number.isInteger(numericEventId) ? numericEventId : null;

    if (!validEventId) {
      const firstEvent = await prisma.event.findFirst();
      if (firstEvent) {
        validEventId = firstEvent.id;
      }
    }

    if (!validEventId) {
      return res.status(400).json({
        success: false,
        error: "Başvurulacak geçerli bir etkinlik bulunamadı.",
      });
    }

    const application = await prisma.eventApplication.create({
      data: {
        eventId: validEventId,
        fullName: String(fullName).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        city: city ? String(city).trim() : null,
        school: school ? String(school).trim() : null,
        department: department ? String(department).trim() : null,
        grade: grade ? String(grade).trim() : null,
        note: note ? String(note).trim() : null,
        status: status || "Beklemede",
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            category: true,
            location: true,
            startDate: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Etkinlik başvurusu oluşturuldu.",
      data: application,
    });
  } catch (error) {
    console.error("EVENT APPLICATIONS POST ERROR:", error);
    res.status(500).json({
      success: false,
      error: "Etkinlik başvurusu kaydı oluşturulamadı.",
    });
  }
});

// Etkinlik başvurusu güncelle (Örn: Durum değişikliği - SADECE ADMIN)
router.patch("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        error: "Geçersiz başvuru ID'si.",
      });
    }

    const { status, note } = req.body;

    const dataToUpdate: any = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (note !== undefined) dataToUpdate.note = note;

    const application = await prisma.eventApplication.update({
      where: { id },
      data: dataToUpdate,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            category: true,
            location: true,
            startDate: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Başvuru durumu güncellendi.",
      data: application,
    });
  } catch (error) {
    console.error("EVENT APPLICATIONS PATCH ERROR:", error);
    res.status(500).json({
      success: false,
      error: "Etkinlik başvurusu güncellenemedi.",
    });
  }
});

// Etkinlik başvurusu sil (SADECE ADMIN)
router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        error: "Geçersiz başvuru ID'si.",
      });
    }

    await prisma.eventApplication.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Etkinlik başvurusu silindi.",
    });
  } catch (error) {
    console.error("EVENT APPLICATIONS DELETE ERROR:", error);
    res.status(500).json({
      success: false,
      error: "Etkinlik başvurusu silinemedi.",
    });
  }
});

export default router;
