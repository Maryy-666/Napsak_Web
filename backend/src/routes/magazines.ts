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
  const baseSlug = slugify(title) || "dergi";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.magazine.findFirst({
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

// GET /magazines - List magazines
// Admin: GET /magazines?status=all returns all statuses
// Public: returns only publicationStatus = PUBLISHED
router.get("/", async (req, res) => {
  try {
    const isAll = req.query.status === "all";

    const whereCondition = isAll
      ? {}
      : { publicationStatus: "PUBLISHED" };

    const magazines = await prisma.magazine.findMany({
      where: whereCondition,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, data: magazines });
  } catch (error) {
    console.error("MAGAZINES GET ERROR:", error);
    res.status(500).json({ success: false, error: "Dergiler alınamadı." });
  }
});

// GET /magazines/:slug - Get single magazine by slug or id
router.get("/:slug", async (req, res) => {
  try {
    const slugParam = String(req.params.slug);
    const idNum = Number(slugParam);

    const magazine = await prisma.magazine.findFirst({
      where: {
        OR: [
          { slug: slugParam },
          ...(Number.isInteger(idNum) ? [{ id: idNum }] : []),
        ],
      },
    });

    if (!magazine) {
      return res.status(404).json({ success: false, error: "Dergi bulunamadı." });
    }

    // Public check: DRAFT / ARCHIVED should return 404 for public requests
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

    if (!isAdmin && magazine.publicationStatus !== "PUBLISHED") {
      return res.status(404).json({ success: false, error: "Dergi bulunamadı." });
    }

    res.json({ success: true, data: magazine });
  } catch (error) {
    console.error("MAGAZINE GET BY SLUG ERROR:", error);
    res.status(500).json({ success: false, error: "Dergi getirilemedi." });
  }
});

// POST /magazines - Create new magazine (ADMIN ONLY)
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      slug: customSlug,
      issueNumber,
      description,
      pages,
      publishDate,
      pdfUrl,
      coverImage,
      publicationStatus,
      isFeatured,
      displayOrder,
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, error: "Dergi başlığı zorunludur." });
    }

    const finalSlug = customSlug && String(customSlug).trim()
      ? slugify(String(customSlug).trim())
      : await generateUniqueSlug(String(title).trim());

    // Check slug uniqueness
    const existingSlug = await prisma.magazine.findUnique({ where: { slug: finalSlug } });
    if (existingSlug) {
      return res.status(400).json({ success: false, error: "Bu slug adresi başka bir dergi tarafından kullanılıyor." });
    }

    const magazine = await prisma.magazine.create({
      data: {
        title: String(title).trim(),
        slug: finalSlug,
        issueNumber: issueNumber ? String(issueNumber).trim() : null,
        description: description ? String(description).trim() : null,
        pages: pages ? Number(pages) : 36,
        publishDate: publishDate ? String(publishDate).trim() : null,
        pdfUrl: pdfUrl ? String(pdfUrl).trim() : null,
        coverImage: coverImage ? String(coverImage).trim() : null,
        publicationStatus: publicationStatus ? String(publicationStatus) : "PUBLISHED",
        isFeatured: Boolean(isFeatured),
        displayOrder: Number(displayOrder) || 0,
      },
    });

    res.status(201).json({ success: true, data: magazine });
  } catch (error: any) {
    console.error("MAGAZINE CREATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Dergi oluşturulamadı." });
  }
});

// PATCH /magazines/:id - Update magazine (ADMIN ONLY)
router.patch("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existingMagazine = await prisma.magazine.findUnique({ where: { id } });
    if (!existingMagazine) {
      return res.status(404).json({ success: false, error: "Güncellenecek dergi bulunamadı." });
    }

    const {
      title,
      slug: customSlug,
      issueNumber,
      description,
      pages,
      publishDate,
      pdfUrl,
      coverImage,
      publicationStatus,
      isFeatured,
      displayOrder,
    } = req.body;

    let finalSlug = existingMagazine.slug;
    if (customSlug !== undefined && customSlug !== existingMagazine.slug) {
      const candidateSlug = slugify(String(customSlug).trim());
      const duplicate = await prisma.magazine.findFirst({
        where: { slug: candidateSlug, NOT: { id } },
      });
      if (duplicate) {
        return res.status(400).json({ success: false, error: "Bu slug başka bir dergi tarafından kullanılıyor." });
      }
      finalSlug = candidateSlug;
    } else if (title && !existingMagazine.slug) {
      finalSlug = await generateUniqueSlug(String(title).trim(), id);
    }

    const updated = await prisma.magazine.update({
      where: { id },
      data: {
        title: title !== undefined ? String(title).trim() : existingMagazine.title,
        slug: finalSlug,
        issueNumber: issueNumber !== undefined ? (issueNumber ? String(issueNumber).trim() : null) : existingMagazine.issueNumber,
        description: description !== undefined ? (description ? String(description).trim() : null) : existingMagazine.description,
        pages: pages !== undefined ? Number(pages) : existingMagazine.pages,
        publishDate: publishDate !== undefined ? (publishDate ? String(publishDate).trim() : null) : existingMagazine.publishDate,
        pdfUrl: pdfUrl !== undefined ? (pdfUrl ? String(pdfUrl).trim() : null) : existingMagazine.pdfUrl,
        coverImage: coverImage !== undefined ? (coverImage ? String(coverImage).trim() : null) : existingMagazine.coverImage,
        publicationStatus: publicationStatus !== undefined ? String(publicationStatus) : existingMagazine.publicationStatus,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existingMagazine.isFeatured,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existingMagazine.displayOrder,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("MAGAZINE UPDATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Dergi güncellenemedi." });
  }
});

// DELETE /magazines/:id - Delete magazine (ADMIN ONLY)
router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existingMagazine = await prisma.magazine.findUnique({ where: { id } });
    if (!existingMagazine) {
      return res.status(404).json({ success: false, error: "Silinecek dergi bulunamadı." });
    }

    await prisma.magazine.delete({ where: { id } });
    res.json({ success: true, message: "Dergi başarıyla silindi." });
  } catch (error: any) {
    console.error("MAGAZINE DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Dergi silinemedi." });
  }
});

export default router;
