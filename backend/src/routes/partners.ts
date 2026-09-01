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

async function generateUniqueSlug(name: string, currentId?: number): Promise<string> {
  const baseSlug = slugify(name) || "paydas";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.partner.findFirst({
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

// GET /partners - Public: returns active partners; Admin ?status=all: returns all
router.get("/", async (req, res) => {
  try {
    const isAll = req.query.status === "all";

    const whereCondition = isAll ? {} : { isActive: true };

    const partners = await prisma.partner.findMany({
      where: whereCondition,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, data: partners });
  } catch (error: any) {
    console.error("PARTNERS GET ERROR:", error);
    res.status(500).json({ success: false, error: "Paydaşlar alınamadı." });
  }
});

// GET /partners/:idOrSlug - Single partner
router.get("/:idOrSlug", async (req, res) => {
  try {
    const param = String(req.params.idOrSlug);
    const idNum = Number(param);

    const partner = await prisma.partner.findFirst({
      where: {
        OR: [
          { slug: param },
          ...(Number.isInteger(idNum) ? [{ id: idNum }] : []),
        ],
      },
    });

    if (!partner) {
      return res.status(404).json({ success: false, error: "Paydaş bulunamadı." });
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

    if (!isAdmin && !partner.isActive) {
      return res.status(404).json({ success: false, error: "Paydaş bulunamadı." });
    }

    res.json({ success: true, data: partner });
  } catch (error: any) {
    console.error("PARTNER GET BY ID/SLUG ERROR:", error);
    res.status(500).json({ success: false, error: "Paydaş getirilemedi." });
  }
});

// POST /partners - Create partner (ADMIN ONLY)
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      nameEn,
      slug: customSlug,
      description,
      descriptionEn,
      logo,
      websiteUrl,
      category,
      categoryEn,
      isActive,
      displayOrder,
    } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ success: false, error: "Kurum adı zorunludur." });
    }

    const finalSlug = customSlug && String(customSlug).trim()
      ? slugify(String(customSlug).trim())
      : await generateUniqueSlug(String(name).trim());

    const existingSlug = await prisma.partner.findUnique({ where: { slug: finalSlug } });
    if (existingSlug) {
      return res.status(400).json({ success: false, error: "Bu slug baska bir paydaş tarafından kullanılıyor." });
    }

    const partner = await prisma.partner.create({
      data: {
        name: String(name).trim(),
        nameEn: nameEn ? String(nameEn).trim() : null,
        slug: finalSlug,
        description: description ? String(description).trim() : null,
        descriptionEn: descriptionEn ? String(descriptionEn).trim() : null,
        logo: logo ? String(logo).trim() : null,
        websiteUrl: websiteUrl ? String(websiteUrl).trim() : null,
        category: category ? String(category).trim() : "Paydaş",
        categoryEn: categoryEn ? String(categoryEn).trim() : "Partner",
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        displayOrder: Number(displayOrder) || 0,
      },
    });

    res.status(201).json({ success: true, data: partner });
  } catch (error: any) {
    console.error("PARTNER CREATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Paydaş oluşturulamadı." });
  }
});

// PATCH /partners/:id - Update partner (ADMIN ONLY)
router.patch("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existingPartner = await prisma.partner.findUnique({ where: { id } });
    if (!existingPartner) {
      return res.status(404).json({ success: false, error: "Güncellenecek paydaş bulunamadı." });
    }

    const {
      name,
      nameEn,
      slug: customSlug,
      description,
      descriptionEn,
      logo,
      websiteUrl,
      category,
      categoryEn,
      isActive,
      displayOrder,
    } = req.body;

    let finalSlug = existingPartner.slug;
    if (customSlug !== undefined && customSlug !== existingPartner.slug) {
      const candidateSlug = slugify(String(customSlug).trim());
      const duplicate = await prisma.partner.findFirst({
        where: { slug: candidateSlug, NOT: { id } },
      });
      if (duplicate) {
        return res.status(400).json({ success: false, error: "Bu slug başka bir paydaş tarafından kullanılıyor." });
      }
      finalSlug = candidateSlug;
    } else if (name && !existingPartner.slug) {
      finalSlug = await generateUniqueSlug(String(name).trim(), id);
    }

    const updated = await prisma.partner.update({
      where: { id },
      data: {
        name: name !== undefined ? String(name).trim() : existingPartner.name,
        nameEn: nameEn !== undefined ? (nameEn ? String(nameEn).trim() : null) : existingPartner.nameEn,
        slug: finalSlug,
        description: description !== undefined ? (description ? String(description).trim() : null) : existingPartner.description,
        descriptionEn: descriptionEn !== undefined ? (descriptionEn ? String(descriptionEn).trim() : null) : existingPartner.descriptionEn,
        logo: logo !== undefined ? (logo ? String(logo).trim() : null) : existingPartner.logo,
        websiteUrl: websiteUrl !== undefined ? (websiteUrl ? String(websiteUrl).trim() : null) : existingPartner.websiteUrl,
        category: category !== undefined ? String(category).trim() : existingPartner.category,
        categoryEn: categoryEn !== undefined ? (categoryEn ? String(categoryEn).trim() : null) : existingPartner.categoryEn,
        isActive: isActive !== undefined ? Boolean(isActive) : existingPartner.isActive,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existingPartner.displayOrder,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PARTNER UPDATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Paydaş güncellenemedi." });
  }
});

// DELETE /partners/:id - Delete partner (ADMIN ONLY)
router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existingPartner = await prisma.partner.findUnique({ where: { id } });
    if (!existingPartner) {
      return res.status(404).json({ success: false, error: "Silinecek paydaş bulunamadı." });
    }

    await prisma.partner.delete({ where: { id } });
    res.json({ success: true, message: "Paydaş başarıyla silindi." });
  } catch (error: any) {
    console.error("PARTNER DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Paydaş silinemedi." });
  }
});

export default router;
