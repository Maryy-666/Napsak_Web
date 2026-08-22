import { Router } from "express";
import prisma from "../db.js";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();

// GET /homepage/hero - List hero slides
router.get("/hero", async (req, res) => {
  try {
    const isAll = req.query.status === "all";
    const whereCondition = isAll ? {} : { isActive: true };

    const slides = await prisma.homepageHero.findMany({
      where: whereCondition,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, data: slides });
  } catch (error) {
    console.error("HOMEPAGE HERO GET ERROR:", error);
    res.status(500).json({ success: false, error: "Hero slaytları alınamadı." });
  }
});

// POST /homepage/hero - Create hero slide (ADMIN ONLY)
router.post("/hero", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      badge,
      title,
      highlightText,
      description,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      imageUrl,
      displayOrder,
      isActive,
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, error: "Hero başlığı zorunludur." });
    }

    const created = await prisma.homepageHero.create({
      data: {
        badge: badge ? String(badge).trim() : null,
        title: String(title).trim(),
        highlightText: highlightText ? String(highlightText).trim() : null,
        description: description ? String(description).trim() : "",
        primaryCtaText: primaryCtaText ? String(primaryCtaText).trim() : null,
        primaryCtaLink: primaryCtaLink ? String(primaryCtaLink).trim() : null,
        secondaryCtaText: secondaryCtaText ? String(secondaryCtaText).trim() : null,
        secondaryCtaLink: secondaryCtaLink ? String(secondaryCtaLink).trim() : null,
        imageUrl: imageUrl ? String(imageUrl).trim() : null,
        displayOrder: Number(displayOrder) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    console.error("HOMEPAGE HERO CREATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Hero slaytı oluşturulamadı." });
  }
});

// PATCH /homepage/hero/:id - Update hero slide (ADMIN ONLY)
router.patch("/hero/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existing = await prisma.homepageHero.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Güncellenecek slayt bulunamadı." });
    }

    const {
      badge,
      title,
      highlightText,
      description,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      imageUrl,
      displayOrder,
      isActive,
    } = req.body;

    const updated = await prisma.homepageHero.update({
      where: { id },
      data: {
        badge: badge !== undefined ? (badge ? String(badge).trim() : null) : existing.badge,
        title: title !== undefined ? String(title).trim() : existing.title,
        highlightText: highlightText !== undefined ? (highlightText ? String(highlightText).trim() : null) : existing.highlightText,
        description: description !== undefined ? String(description).trim() : existing.description,
        primaryCtaText: primaryCtaText !== undefined ? (primaryCtaText ? String(primaryCtaText).trim() : null) : existing.primaryCtaText,
        primaryCtaLink: primaryCtaLink !== undefined ? (primaryCtaLink ? String(primaryCtaLink).trim() : null) : existing.primaryCtaLink,
        secondaryCtaText: secondaryCtaText !== undefined ? (secondaryCtaText ? String(secondaryCtaText).trim() : null) : existing.secondaryCtaText,
        secondaryCtaLink: secondaryCtaLink !== undefined ? (secondaryCtaLink ? String(secondaryCtaLink).trim() : null) : existing.secondaryCtaLink,
        imageUrl: imageUrl !== undefined ? (imageUrl ? String(imageUrl).trim() : null) : existing.imageUrl,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existing.displayOrder,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("HOMEPAGE HERO UPDATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Hero slaytı güncellenemedi." });
  }
});

// DELETE /homepage/hero/:id - Delete hero slide (ADMIN ONLY)
router.delete("/hero/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existing = await prisma.homepageHero.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: "Silinecek slayt bulunamadı." });
    }

    await prisma.homepageHero.delete({ where: { id } });
    res.json({ success: true, message: "Hero slaytı silindi." });
  } catch (error: any) {
    console.error("HOMEPAGE HERO DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Hero slaytı silinemedi." });
  }
});

// GET /homepage/config/:key - Get section config by key
router.get("/config/:key", async (req, res) => {
  try {
    const key = String(req.params.key).trim();
    const config = await prisma.homepageConfig.findUnique({ where: { key } });

    if (!config) {
      return res.status(404).json({ success: false, error: "Ayar bulunamadı." });
    }

    res.json({ success: true, data: config.content });
  } catch (error) {
    console.error("HOMEPAGE CONFIG GET ERROR:", error);
    res.status(500).json({ success: false, error: "Ayar getirilemedi." });
  }
});

// POST /homepage/config/:key - Save section config by key (ADMIN ONLY)
router.post("/config/:key", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const key = String(req.params.key).trim();
    const content = req.body;

    if (!content) {
      return res.status(400).json({ success: false, error: "İçerik verisi zorunludur." });
    }

    const updated = await prisma.homepageConfig.upsert({
      where: { key },
      update: { content },
      create: { key, content },
    });

    res.json({ success: true, data: updated.content });
  } catch (error: any) {
    console.error("HOMEPAGE CONFIG SAVE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Ayar kaydedilemedi." });
  }
});

export default router;
