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
  const baseSlug = slugify(title) || "rapor";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.report.findFirst({
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

// GET /reports - List reports
// Admin: GET /reports?status=all returns all statuses
// Public: returns only publicationStatus = PUBLISHED
router.get("/", async (req, res) => {
  try {
    const isAll = req.query.status === "all";

    const whereCondition = isAll
      ? {}
      : { publicationStatus: "PUBLISHED" };

    const reports = await prisma.report.findMany({
      where: whereCondition,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, data: reports });
  } catch (error) {
    console.error("REPORTS GET ERROR:", error);
    res.status(500).json({ success: false, error: "Raporlar alınamadı." });
  }
});

// GET /reports/:slug - Get single report by slug or id
router.get("/:slug", async (req, res) => {
  try {
    const slugParam = String(req.params.slug);
    const idNum = Number(slugParam);

    const report = await prisma.report.findFirst({
      where: {
        OR: [
          { slug: slugParam },
          ...(Number.isInteger(idNum) ? [{ id: idNum }] : []),
        ],
      },
    });

    if (!report) {
      return res.status(404).json({ success: false, error: "Rapor bulunamadı." });
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

    if (!isAdmin && report.publicationStatus !== "PUBLISHED") {
      return res.status(404).json({ success: false, error: "Rapor bulunamadı." });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error("REPORT GET BY SLUG ERROR:", error);
    res.status(500).json({ success: false, error: "Rapor getirilemedi." });
  }
});

// POST /reports - Create new report (ADMIN ONLY)
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      slug: customSlug,
      category,
      summary,
      description,
      fileName,
      fileSize,
      pdfUrl,
      coverImage,
      publishDate,
      publicationStatus,
      isFeatured,
      displayOrder,
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, error: "Rapor başlığı zorunludur." });
    }

    const finalSlug = customSlug && String(customSlug).trim()
      ? slugify(String(customSlug).trim())
      : await generateUniqueSlug(String(title).trim());

    // Check slug uniqueness
    const existingSlug = await prisma.report.findUnique({ where: { slug: finalSlug } });
    if (existingSlug) {
      return res.status(400).json({ success: false, error: "Bu slug adresi başka bir rapor tarafından kullanılıyor." });
    }

    const report = await prisma.report.create({
      data: {
        title: String(title).trim(),
        slug: finalSlug,
        category: category ? String(category).trim() : null,
        summary: summary ? String(summary).trim() : null,
        description: description ? String(description).trim() : null,
        fileName: fileName ? String(fileName).trim() : null,
        fileSize: fileSize ? String(fileSize).trim() : null,
        pdfUrl: pdfUrl ? String(pdfUrl).trim() : null,
        coverImage: coverImage ? String(coverImage).trim() : null,
        publishDate: publishDate ? String(publishDate).trim() : null,
        publicationStatus: publicationStatus ? String(publicationStatus) : "PUBLISHED",
        isFeatured: Boolean(isFeatured),
        displayOrder: Number(displayOrder) || 0,
      },
    });

    res.status(201).json({ success: true, data: report });
  } catch (error: any) {
    console.error("REPORT CREATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Rapor oluşturulamadı." });
  }
});

// PATCH /reports/:id - Update report (ADMIN ONLY)
router.patch("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existingReport = await prisma.report.findUnique({ where: { id } });
    if (!existingReport) {
      return res.status(404).json({ success: false, error: "Güncellenecek rapor bulunamadı." });
    }

    const {
      title,
      slug: customSlug,
      category,
      summary,
      description,
      fileName,
      fileSize,
      pdfUrl,
      coverImage,
      publishDate,
      publicationStatus,
      isFeatured,
      displayOrder,
    } = req.body;

    let finalSlug = existingReport.slug;
    if (customSlug !== undefined && customSlug !== existingReport.slug) {
      const candidateSlug = slugify(String(customSlug).trim());
      const duplicate = await prisma.report.findFirst({
        where: { slug: candidateSlug, NOT: { id } },
      });
      if (duplicate) {
        return res.status(400).json({ success: false, error: "Bu slug başka bir rapor tarafından kullanılıyor." });
      }
      finalSlug = candidateSlug;
    } else if (title && !existingReport.slug) {
      finalSlug = await generateUniqueSlug(String(title).trim(), id);
    }

    const updated = await prisma.report.update({
      where: { id },
      data: {
        title: title !== undefined ? String(title).trim() : existingReport.title,
        slug: finalSlug,
        category: category !== undefined ? (category ? String(category).trim() : null) : existingReport.category,
        summary: summary !== undefined ? (summary ? String(summary).trim() : null) : existingReport.summary,
        description: description !== undefined ? (description ? String(description).trim() : null) : existingReport.description,
        fileName: fileName !== undefined ? (fileName ? String(fileName).trim() : null) : existingReport.fileName,
        fileSize: fileSize !== undefined ? (fileSize ? String(fileSize).trim() : null) : existingReport.fileSize,
        pdfUrl: pdfUrl !== undefined ? (pdfUrl ? String(pdfUrl).trim() : null) : existingReport.pdfUrl,
        coverImage: coverImage !== undefined ? (coverImage ? String(coverImage).trim() : null) : existingReport.coverImage,
        publishDate: publishDate !== undefined ? (publishDate ? String(publishDate).trim() : null) : existingReport.publishDate,
        publicationStatus: publicationStatus !== undefined ? String(publicationStatus) : existingReport.publicationStatus,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existingReport.isFeatured,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existingReport.displayOrder,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("REPORT UPDATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Rapor güncellenemedi." });
  }
});

// DELETE /reports/:id - Delete report (ADMIN ONLY)
router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existingReport = await prisma.report.findUnique({ where: { id } });
    if (!existingReport) {
      return res.status(404).json({ success: false, error: "Silinecek rapor bulunamadı." });
    }

    await prisma.report.delete({ where: { id } });
    res.json({ success: true, message: "Rapor başarıyla silindi." });
  } catch (error: any) {
    console.error("REPORT DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Rapor silinemedi." });
  }
});

export default router;
