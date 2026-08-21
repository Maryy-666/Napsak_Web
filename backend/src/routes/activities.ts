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

// Tüm faaliyetleri getir - HERKES
router.get("/", async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(activities);
  } catch (error) {
    console.error("ACTIVITIES GET ERROR:", error);
    res.status(500).json({
      error: "Faaliyetler getirilemedi.",
    });
  }
});

// Yeni faaliyet oluştur
router.post("/", async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      team,
      status,
      date,
      location,
      summary,
      participantCount,
      image,
      rotation,
      pinColor,
      noteBg,
      borderColor,
      badgeBg,
      badgeText,
      mottoText,
      tagText,
      tapeColor,
      tapeRotation,
      youthStickerIconName,
      stickerBadgeBg,
      objectives,
      impactMetrics,
      outcomes,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        error: "Faaliyet başlığı zorunludur.",
      });
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        type: type || "polaroid",
        category: category || "Genel",
        team: team || "N'apsak Ekibi",
        status: status || "Devam Eden",
        date: date || null,
        location: location || null,
        summary: summary || null,
        participantCount: participantCount ? Number(participantCount) : 0,
        image: image || null,
        rotation: rotation || "-rotate-1",
        pinColor: pinColor || "text-[#0A5C3A]",
        noteBg: noteBg || "bg-white",
        borderColor: borderColor || "border-[#DDE7E1]",
        badgeBg: badgeBg || "bg-[#0A5C3A]",
        badgeText: badgeText || "text-white",
        mottoText: mottoText || null,
        tagText: tagText || null,
        tapeColor: tapeColor || null,
        tapeRotation: tapeRotation || null,
        youthStickerIconName: youthStickerIconName || null,
        stickerBadgeBg: stickerBadgeBg || null,
        objectives: Array.isArray(objectives) ? objectives : [],
        impactMetrics: impactMetrics || null,
        outcomes: Array.isArray(outcomes) ? outcomes : [],
      },
    });

    res.status(201).json({
      message: "Faaliyet başarıyla oluşturuldu.",
      data: activity,
    });
  } catch (error) {
    console.error("ACTIVITIES POST ERROR:", error);
    res.status(500).json({
      error: "Faaliyet oluşturulamadı.",
    });
  }
});

// Faaliyet güncelle
router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Geçersiz faaliyet ID'si.",
      });
    }

    const data = { ...req.body };
    delete data.id;

    if (data.participantCount !== undefined) {
      data.participantCount = Number(data.participantCount);
    }

    const activity = await prisma.activity.update({
      where: { id },
      data,
    });

    res.json({
      message: "Faaliyet başarıyla güncellendi.",
      data: activity,
    });
  } catch (error) {
    console.error("ACTIVITIES PATCH ERROR:", error);
    res.status(500).json({
      error: "Faaliyet güncellenemedi.",
    });
  }
});

// Faaliyet sil
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        error: "Geçersiz faaliyet ID'si.",
      });
    }

    await prisma.activity.delete({
      where: { id },
    });

    res.json({
      message: "Faaliyet başarıyla silindi.",
    });
  } catch (error) {
    console.error("ACTIVITIES DELETE ERROR:", error);
    res.status(500).json({
      error: "Faaliyet silinemedi.",
    });
  }
});

export default router;
