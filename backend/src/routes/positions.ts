import { Router } from "express";
import prisma from "../db.js";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/Ğ/g, "g")
    .replace(/Ü/g, "u")
    .replace(/Ş/g, "s")
    .replace(/İ/g, "i")
    .replace(/Ö/g, "o")
    .replace(/Ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function generateUniqueSlug(title: string, currentId?: number): Promise<string> {
  const baseSlug = slugify(title) || "pozisyon";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.position.findFirst({
      where: {
        slug,
        ...(currentId ? { NOT: { id: currentId } } : {}),
      },
    });

    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// GET /positions - Public returns active positions; Admin ?status=all returns all positions
router.get("/", async (req, res) => {
  try {
    const isAll = req.query.status === "all";

    // Public gets active positions only
    const whereCondition = isAll ? {} : { isActive: true };

    const positions = await prisma.position.findMany({
      where: whereCondition,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, data: positions });
  } catch (error: any) {
    console.error("POSITIONS GET ERROR:", error);
    res.status(500).json({ success: false, error: "Açık pozisyonlar alınamadı." });
  }
});

// GET /positions/:idOrSlug - Get single position by ID or slug
router.get("/:idOrSlug", async (req, res) => {
  try {
    const param = String(req.params.idOrSlug);
    const idNum = Number(param);

    const position = await prisma.position.findFirst({
      where: {
        OR: [
          { slug: param },
          ...(Number.isInteger(idNum) ? [{ id: idNum }] : []),
        ],
      },
    });

    if (!position) {
      return res.status(404).json({ success: false, error: "Pozisyon bulunamadı." });
    }

    const authHeader = req.headers.authorization;
    let isAdmin = false;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
      if (session && session.user.role === "ADMIN" && session.expiresAt > new Date()) {
        isAdmin = true;
      }
    }

    if (!isAdmin && !position.isActive) {
      return res.status(404).json({ success: false, error: "Pozisyon bulunamadı." });
    }

    res.json({ success: true, data: position });
  } catch (error: any) {
    console.error("POSITION GET BY ID/SLUG ERROR:", error);
    res.status(500).json({ success: false, error: "Pozisyon getirilemedi." });
  }
});

// POST /positions - Create new open position (ADMIN ONLY)
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      titleEn,
      slug: customSlug,
      team,
      teamEn,
      teamCategory,
      shortDescription,
      shortDescriptionEn,
      description,
      descriptionEn,
      responsibilities,
      responsibilitiesEn,
      requirements,
      requirementsEn,
      preferredQualifications,
      preferredQualificationsEn,
      workType,
      workTypeEn,
      location,
      locationEn,
      isActive,
      isUrgent,
      displayOrder,
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, error: "Pozisyon başlığı zorunludur." });
    }

    const finalSlug = customSlug && String(customSlug).trim()
      ? slugify(String(customSlug).trim())
      : await generateUniqueSlug(String(title).trim());

    const existingSlug = await prisma.position.findUnique({ where: { slug: finalSlug } });
    if (existingSlug) {
      return res.status(400).json({ success: false, error: "Bu slug adresi başka bir pozisyon tarafından kullanılıyor." });
    }

    const position = await prisma.position.create({
      data: {
        title: String(title).trim(),
        titleEn: titleEn ? String(titleEn).trim() : null,
        slug: finalSlug,
        team: team ? String(team).trim() : "Genel",
        teamEn: teamEn ? String(teamEn).trim() : null,
        teamCategory: teamCategory ? String(teamCategory).trim() : "iletisim",
        shortDescription: shortDescription ? String(shortDescription).trim() : "",
        shortDescriptionEn: shortDescriptionEn ? String(shortDescriptionEn).trim() : null,
        description: description ? String(description).trim() : null,
        descriptionEn: descriptionEn ? String(descriptionEn).trim() : null,
        responsibilities: Array.isArray(responsibilities) ? responsibilities.map(String) : [],
        responsibilitiesEn: Array.isArray(responsibilitiesEn) ? responsibilitiesEn.map(String) : [],
        requirements: Array.isArray(requirements) ? requirements.map(String) : [],
        requirementsEn: Array.isArray(requirementsEn) ? requirementsEn.map(String) : [],
        preferredQualifications: Array.isArray(preferredQualifications) ? preferredQualifications.map(String) : [],
        preferredQualificationsEn: Array.isArray(preferredQualificationsEn) ? preferredQualificationsEn.map(String) : [],
        workType: workType ? String(workType).trim() : "Gönüllü",
        workTypeEn: workTypeEn ? String(workTypeEn).trim() : "Volunteer / Remote",
        location: location ? String(location).trim() : "Uzaktan / Çevrim İçi",
        locationEn: locationEn ? String(locationEn).trim() : "Remote / Online",
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        isUrgent: isUrgent !== undefined ? Boolean(isUrgent) : false,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    res.status(201).json({ success: true, data: position });
  } catch (error: any) {
    console.error("POSITION CREATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Pozisyon oluşturulamadı." });
  }
});

// PATCH /positions/:id - Update position (ADMIN ONLY)
router.patch("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existingPos = await prisma.position.findUnique({ where: { id } });
    if (!existingPos) {
      return res.status(404).json({ success: false, error: "Güncellenecek pozisyon bulunamadı." });
    }

    const {
      title,
      titleEn,
      slug: customSlug,
      team,
      teamEn,
      teamCategory,
      shortDescription,
      shortDescriptionEn,
      description,
      descriptionEn,
      responsibilities,
      responsibilitiesEn,
      requirements,
      requirementsEn,
      preferredQualifications,
      preferredQualificationsEn,
      workType,
      workTypeEn,
      location,
      locationEn,
      isActive,
      isUrgent,
      displayOrder,
    } = req.body;

    let finalSlug = existingPos.slug;
    if (customSlug !== undefined && customSlug !== existingPos.slug) {
      const candidateSlug = slugify(String(customSlug).trim());
      const duplicate = await prisma.position.findFirst({
        where: { slug: candidateSlug, NOT: { id } },
      });
      if (duplicate) {
        return res.status(400).json({ success: false, error: "Bu slug adresi başka bir pozisyon tarafından kullanılıyor." });
      }
      finalSlug = candidateSlug;
    } else if (title && !existingPos.slug) {
      finalSlug = await generateUniqueSlug(String(title).trim(), id);
    }

    const updated = await prisma.position.update({
      where: { id },
      data: {
        title: title !== undefined ? String(title).trim() : existingPos.title,
        titleEn: titleEn !== undefined ? (titleEn ? String(titleEn).trim() : null) : existingPos.titleEn,
        slug: finalSlug,
        team: team !== undefined ? String(team).trim() : existingPos.team,
        teamEn: teamEn !== undefined ? (teamEn ? String(teamEn).trim() : null) : existingPos.teamEn,
        teamCategory: teamCategory !== undefined ? String(teamCategory).trim() : existingPos.teamCategory,
        shortDescription: shortDescription !== undefined ? String(shortDescription).trim() : existingPos.shortDescription,
        shortDescriptionEn: shortDescriptionEn !== undefined ? (shortDescriptionEn ? String(shortDescriptionEn).trim() : null) : existingPos.shortDescriptionEn,
        description: description !== undefined ? (description ? String(description).trim() : null) : existingPos.description,
        descriptionEn: descriptionEn !== undefined ? (descriptionEn ? String(descriptionEn).trim() : null) : existingPos.descriptionEn,
        responsibilities: Array.isArray(responsibilities) ? responsibilities.map(String) : existingPos.responsibilities,
        responsibilitiesEn: Array.isArray(responsibilitiesEn) ? responsibilitiesEn.map(String) : existingPos.responsibilitiesEn,
        requirements: Array.isArray(requirements) ? requirements.map(String) : existingPos.requirements,
        requirementsEn: Array.isArray(requirementsEn) ? requirementsEn.map(String) : existingPos.requirementsEn,
        preferredQualifications: Array.isArray(preferredQualifications) ? preferredQualifications.map(String) : existingPos.preferredQualifications,
        preferredQualificationsEn: Array.isArray(preferredQualificationsEn) ? preferredQualificationsEn.map(String) : existingPos.preferredQualificationsEn,
        workType: workType !== undefined ? String(workType).trim() : existingPos.workType,
        workTypeEn: workTypeEn !== undefined ? (workTypeEn ? String(workTypeEn).trim() : null) : existingPos.workTypeEn,
        location: location !== undefined ? String(location).trim() : existingPos.location,
        locationEn: locationEn !== undefined ? (locationEn ? String(locationEn).trim() : null) : existingPos.locationEn,
        isActive: isActive !== undefined ? Boolean(isActive) : existingPos.isActive,
        isUrgent: isUrgent !== undefined ? Boolean(isUrgent) : existingPos.isUrgent,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existingPos.displayOrder,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("POSITION UPDATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Pozisyon güncellenemedi." });
  }
});

// DELETE /positions/:id - Delete position (ADMIN ONLY)
router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existingPos = await prisma.position.findUnique({ where: { id } });
    if (!existingPos) {
      return res.status(404).json({ success: false, error: "Silinecek pozisyon bulunamadı." });
    }

    await prisma.position.delete({ where: { id } });
    res.json({ success: true, message: "Pozisyon başarıyla silindi." });
  } catch (error: any) {
    console.error("POSITION DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Pozisyon silinemedi." });
  }
});

export default router;
