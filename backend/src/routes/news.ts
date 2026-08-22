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
  const baseSlug = slugify(title) || "haber";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.news.findFirst({
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

// GET /news - List news items
router.get("/", async (req, res) => {
  try {
    const isAll = req.query.status === "all";
    const whereCondition = isAll ? {} : { publicationStatus: "PUBLISHED" };

    const newsList = await prisma.news.findMany({
      where: whereCondition,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, data: newsList });
  } catch (error) {
    console.error("NEWS GET ERROR:", error);
    res.status(500).json({ success: false, error: "Haberler alınamadı." });
  }
});

// GET /news/:slug - Get single news item by slug or id
router.get("/:slug", async (req, res) => {
  try {
    const slugParam = String(req.params.slug);
    const idNum = Number(slugParam);

    const newsItem = await prisma.news.findFirst({
      where: {
        OR: [
          { slug: slugParam },
          ...(Number.isInteger(idNum) ? [{ id: idNum }] : []),
        ],
      },
    });

    if (!newsItem) {
      return res.status(404).json({ success: false, error: "Haber bulunamadı." });
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

    if (!isAdmin && newsItem.publicationStatus !== "PUBLISHED") {
      return res.status(404).json({ success: false, error: "Haber bulunamadı." });
    }

    res.json({ success: true, data: newsItem });
  } catch (error) {
    console.error("NEWS GET BY SLUG ERROR:", error);
    res.status(500).json({ success: false, error: "Haber getirilemedi." });
  }
});

// POST /news - Create news item (ADMIN ONLY)
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      slug: customSlug,
      summary,
      content,
      coverImage,
      category,
      publishDate,
      readTime,
      publicationStatus,
      isFeatured,
      displayOrder,
      quoteText,
      quoteAuthor,
      quoteTitle,
      images,
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, error: "Haber başlığı zorunludur." });
    }

    const finalSlug = customSlug && String(customSlug).trim()
      ? slugify(String(customSlug).trim())
      : await generateUniqueSlug(String(title).trim());

    const existingSlug = await prisma.news.findUnique({ where: { slug: finalSlug } });
    if (existingSlug) {
      return res.status(400).json({ success: false, error: "Bu slug adresi başka bir haber tarafından kullanılıyor." });
    }

    const created = await prisma.news.create({
      data: {
        title: String(title).trim(),
        slug: finalSlug,
        summary: summary ? String(summary).trim() : null,
        content: content ? String(content).trim() : "",
        coverImage: coverImage ? String(coverImage).trim() : null,
        category: category ? String(category).trim() : "Duyuru",
        publishDate: publishDate ? String(publishDate).trim() : null,
        readTime: readTime ? String(readTime).trim() : "3 dk",
        publicationStatus: publicationStatus ? String(publicationStatus) : "PUBLISHED",
        isFeatured: Boolean(isFeatured),
        displayOrder: Number(displayOrder) || 0,
        quoteText: quoteText ? String(quoteText).trim() : null,
        quoteAuthor: quoteAuthor ? String(quoteAuthor).trim() : null,
        quoteTitle: quoteTitle ? String(quoteTitle).trim() : null,
        images: Array.isArray(images) ? images.map((i: any) => String(i)) : [],
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    console.error("NEWS CREATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Haber oluşturulamadı." });
  }
});

// PATCH /news/:id - Update news item (ADMIN ONLY)
router.patch("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return res.status(404).json({ success: false, error: "Güncellenecek haber bulunamadı." });
    }

    const {
      title,
      slug: customSlug,
      summary,
      content,
      coverImage,
      category,
      publishDate,
      readTime,
      publicationStatus,
      isFeatured,
      displayOrder,
      quoteText,
      quoteAuthor,
      quoteTitle,
      images,
    } = req.body;

    let finalSlug = existingNews.slug;
    if (customSlug !== undefined && customSlug !== existingNews.slug) {
      const candidateSlug = slugify(String(customSlug).trim());
      const duplicate = await prisma.news.findFirst({
        where: { slug: candidateSlug, NOT: { id } },
      });
      if (duplicate) {
        return res.status(400).json({ success: false, error: "Bu slug başka bir haber tarafından kullanılıyor." });
      }
      finalSlug = candidateSlug;
    } else if (title && !existingNews.slug) {
      finalSlug = await generateUniqueSlug(String(title).trim(), id);
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title: title !== undefined ? String(title).trim() : existingNews.title,
        slug: finalSlug,
        summary: summary !== undefined ? (summary ? String(summary).trim() : null) : existingNews.summary,
        content: content !== undefined ? String(content).trim() : existingNews.content,
        coverImage: coverImage !== undefined ? (coverImage ? String(coverImage).trim() : null) : existingNews.coverImage,
        category: category !== undefined ? (category ? String(category).trim() : "Duyuru") : existingNews.category,
        publishDate: publishDate !== undefined ? (publishDate ? String(publishDate).trim() : null) : existingNews.publishDate,
        readTime: readTime !== undefined ? (readTime ? String(readTime).trim() : "3 dk") : existingNews.readTime,
        publicationStatus: publicationStatus !== undefined ? String(publicationStatus) : existingNews.publicationStatus,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existingNews.isFeatured,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : existingNews.displayOrder,
        quoteText: quoteText !== undefined ? (quoteText ? String(quoteText).trim() : null) : existingNews.quoteText,
        quoteAuthor: quoteAuthor !== undefined ? (quoteAuthor ? String(quoteAuthor).trim() : null) : existingNews.quoteAuthor,
        quoteTitle: quoteTitle !== undefined ? (quoteTitle ? String(quoteTitle).trim() : null) : existingNews.quoteTitle,
        images: images !== undefined ? (Array.isArray(images) ? images.map((i: any) => String(i)) : []) : existingNews.images,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("NEWS UPDATE ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Haber güncellenemedi." });
  }
});

// DELETE /news/:id - Delete news item (ADMIN ONLY)
router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, error: "Geçersiz ID." });
    }

    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return res.status(404).json({ success: false, error: "Silinecek haber bulunamadı." });
    }

    await prisma.news.delete({ where: { id } });
    res.json({ success: true, message: "Haber başarıyla silindi." });
  } catch (error: any) {
    console.error("NEWS DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Haber silinemedi." });
  }
});

export default router;
