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

// GET /position-applications - List position applications (ADMIN sees all, USER sees own)
router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { positionId, status } = req.query;

    const where: any = {};

    // If user is not admin, only fetch their own applications
    if (req.user?.role !== "ADMIN") {
      where.userId = req.user!.id;
    } else {
      if (positionId && positionId !== "all") {
        where.positionId = Number(positionId);
      }
      if (status && status !== "all") {
        where.status = String(status);
      }
    }

    const applications = await prisma.positionApplication.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        position: {
          select: {
            id: true,
            title: true,
            team: true,
            workType: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(applications);
  } catch (error) {
    console.error("POSITION APPLICATION GET ERROR:", error);
    res.status(500).json({ error: "Başvurular getirilemedi." });
  }
});

// GET /position-applications/my - Fetch current user's position applications
router.get("/my", authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Giriş yapmalısınız." });
    }

    const applications = await prisma.positionApplication.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        position: {
          select: {
            id: true,
            title: true,
            team: true,
            workType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(applications);
  } catch (error) {
    console.error("MY POSITION APPLICATION GET ERROR:", error);
    res.status(500).json({ error: "Başvurularınız getirilemedi." });
  }
});

// GET /position-applications/:id - Fetch single position application
router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Geçersiz başvuru ID." });
    }

    const application = await prisma.positionApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        position: true,
      },
    });

    if (!application) {
      return res.status(404).json({ error: "Başvuru bulunamadı." });
    }

    if (req.user?.role !== "ADMIN" && application.userId !== req.user?.id) {
      return res.status(403).json({ error: "Bu başvuruyu görüntüleme yetkiniz yok." });
    }

    res.json(application);
  } catch (error) {
    console.error("POSITION APPLICATION GET BY ID ERROR:", error);
    res.status(500).json({ error: "Başvuru getirilemedi." });
  }
});

// POST /position-applications - Create new position application
router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Başvuru yapmak için giriş yapmalısınız." });
    }

    const { positionId, phone, school, department, cvUrl, whyApply, experience, customAnswers, email, name } = req.body;

    if (!positionId) {
      return res.status(400).json({ error: "Pozisyon seçimi zorunludur." });
    }

    const parsedPositionId = Number(positionId);

    // 1. Verify target Position exists
    let position = await prisma.position.findUnique({
      where: { id: parsedPositionId },
    });

    if (!position) {
      // Fallback: search for active position if ID was created statically
      position = await prisma.position.findFirst({
        where: { isActive: true },
      });
    }

    if (!position) {
      return res.status(404).json({ error: "Seçilen pozisyon veritabanında bulunamadı." });
    }

    // 2. Ensure target User exists in DB (to prevent Foreign Key P2003 error)
    const userEmail = (email || req.user.email || "kullanici@napsak.org").trim().toLowerCase();
    const userName = (name || req.user.name || "Kullanıcı").trim();

    let targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: req.user.id },
          { email: userEmail },
        ],
      },
    });

    if (!targetUser) {
      targetUser = await prisma.user.create({
        data: {
          name: userName,
          email: userEmail,
          passwordHash: "external_auth_hash",
          role: "USER",
        },
      });
    }

    // 3. Check duplicate application
    const existing = await prisma.positionApplication.findUnique({
      where: {
        userId_positionId: {
          userId: targetUser.id,
          positionId: position.id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        error: "Bu pozisyona daha önce başvurdunuz. Aynı pozisyona tekrar başvuru yapılamaz.",
        alreadyApplied: true,
        existingApplication: existing,
      });
    }

    // 4. Create application
    const newApplication = await prisma.positionApplication.create({
      data: {
        userId: targetUser.id,
        positionId: position.id,
        phone: phone ? String(phone).trim() : null,
        school: school ? String(school).trim() : null,
        department: department ? String(department).trim() : null,
        cvUrl: cvUrl ? String(cvUrl).trim() : null,
        whyApply: whyApply ? String(whyApply).trim() : null,
        experience: experience ? String(experience).trim() : null,
        customAnswers: customAnswers || null,
        status: "NEW",
      },
      include: {
        position: {
          select: {
            title: true,
            team: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Pozisyon başvurunuz başarıyla alındı.",
      application: newApplication,
    });
  } catch (error: any) {
    console.error("POSITION APPLICATION POST ERROR:", error);
    if (error.code === "P2002") {
      return res.status(400).json({
        error: "Bu pozisyona daha önce başvurdunuz.",
        alreadyApplied: true,
      });
    }
    res.status(500).json({ error: error?.message || "Başvuru oluşturulurken bir hata oluştu." });
  }
});

// PATCH /position-applications/:id - Update status / admin note (ADMIN ONLY)
router.patch("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Geçersiz başvuru ID." });
    }

    const { status, adminNote } = req.body;
    const dataToUpdate: any = {};

    if (status !== undefined) {
      const validStatuses = ["NEW", "IN_REVIEW", "INTERVIEW", "ACCEPTED", "REJECTED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Geçersiz başvuru durumu." });
      }
      dataToUpdate.status = status;
    }

    if (adminNote !== undefined) {
      dataToUpdate.adminNote = adminNote !== null ? String(adminNote).trim() : null;
    }

    const updated = await prisma.positionApplication.update({
      where: { id },
      data: dataToUpdate,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        position: {
          select: {
            id: true,
            title: true,
            team: true,
          },
        },
      },
    });

    res.json({
      message: "Başvuru başarıyla güncellendi.",
      application: updated,
    });
  } catch (error) {
    console.error("POSITION APPLICATION PATCH ERROR:", error);
    res.status(500).json({ error: "Başvuru güncellenemedi." });
  }
});

// DELETE /position-applications/:id (ADMIN ONLY)
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Geçersiz başvuru ID." });
    }

    await prisma.positionApplication.delete({
      where: { id },
    });

    res.json({ message: "Başvuru başarıyla silindi." });
  } catch (error) {
    console.error("POSITION APPLICATION DELETE ERROR:", error);
    res.status(500).json({ error: "Başvuru silinemedi." });
  }
});

export default router;
