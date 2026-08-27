import { Router } from "express";
import prisma from "../db.js";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();

const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// GET ALL ACTIVITIES (PUBLIC ONLY PUBLISHED, ADMIN GETS ALL)
router.get("/", async (req, res) => {
  try {
    const statusParam = req.query.status ? String(req.query.status).trim() : "PUBLISHED";
    const q = req.query.q ? String(req.query.q).trim() : "";

    const where: any = {};

    if (statusParam === "all" || statusParam === "DRAFT" || statusParam === "ARCHIVED") {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        where.publicationStatus = "PUBLISHED";
      } else {
        const token = authHeader.substring(7);
        const session = await prisma.session.findUnique({
          where: { token },
          include: { user: true },
        });
        if (!session || session.user.role !== "ADMIN") {
          where.publicationStatus = "PUBLISHED";
        } else if (statusParam !== "all") {
          where.publicationStatus = statusParam;
        }
      }
    } else {
      where.publicationStatus = "PUBLISHED";
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error: any) {
    console.error("ACTIVITIES GET ERROR:", error);
    res.status(500).json({ success: false, error: "Faaliyetler getirilemedi." });
  }
});

// CREATE ACTIVITY (ADMIN ONLY)
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const body = req.body;
    const title = String(body.title || "").trim();

    if (!title) {
      return res.status(400).json({ success: false, error: "Faaliyet başlığı zorunludur." });
    }

    let slug = body.slug ? toSlug(body.slug) : toSlug(title);
    if (!slug) slug = `faaliyet-${Date.now()}`;

    const existingSlug = await prisma.activity.findFirst({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const activity = await prisma.activity.create({
      data: {
        slug,
        title,
        type: body.type || "polaroid",
        category: body.category || "Genel",
        team: body.team || "N'apsak Ekibi",
        status: body.status || "Devam Eden",
        publicationStatus: body.publicationStatus || "PUBLISHED",
        isFeatured: Boolean(body.isFeatured),
        date: body.date || null,
        location: body.location || null,
        summary: body.summary || null,
        participantCount: body.participantCount ? Number(body.participantCount) : 0,
        image: body.image || null,
        rotation: body.rotation || "-rotate-1",
        pinColor: body.pinColor || "text-[#0A5C3A]",
        noteBg: body.noteBg || "bg-white",
        borderColor: body.borderColor || "border-[#DDE7E1]",
        badgeBg: body.badgeBg || "bg-[#0A5C3A]",
        badgeText: body.badgeText || "text-white",
        mottoText: body.mottoText || null,
        tagText: body.tagText || null,
        tapeColor: body.tapeColor || null,
        tapeRotation: body.tapeRotation || null,
        youthStickerIconName: body.youthStickerIconName || null,
        stickerBadgeBg: body.stickerBadgeBg || null,
        objectives: Array.isArray(body.objectives) ? body.objectives : [],
        impactMetrics: body.impactMetrics || null,
        outcomes: Array.isArray(body.outcomes) ? body.outcomes : [],
      },
    });

    res.status(201).json({
      success: true,
      message: "Faaliyet başarıyla oluşturuldu.",
      data: activity,
    });
  } catch (error: any) {
    console.error("ACTIVITIES POST ERROR:", error);
    res.status(500).json({ success: false, error: "Faaliyet oluşturulamadı." });
  }
});

// UPDATE ACTIVITY (ADMIN ONLY)
router.patch("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz faaliyet ID'si." });
    }

    const body = { ...req.body };
    delete body.id;

    if (body.participantCount !== undefined) {
      body.participantCount = Number(body.participantCount);
    }

    if (body.title !== undefined) {
      body.title = String(body.title).trim();
      if (!body.title) {
        return res.status(400).json({ success: false, error: "Faaliyet başlığı boş olamaz." });
      }
    }

    const activity = await prisma.activity.update({
      where: { id },
      data: body,
    });

    res.json({
      success: true,
      message: "Faaliyet başarıyla güncellendi.",
      data: activity,
    });
  } catch (error: any) {
    console.error("ACTIVITIES PATCH ERROR:", error);
    res.status(500).json({ success: false, error: "Faaliyet güncellenemedi." });
  }
});

// DELETE ACTIVITY (ADMIN ONLY)
router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz faaliyet ID'si." });
    }

    await prisma.activity.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Faaliyet başarıyla silindi.",
    });
  } catch (error: any) {
    console.error("ACTIVITIES DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Faaliyet silinemedi." });
  }
});

export default router;
