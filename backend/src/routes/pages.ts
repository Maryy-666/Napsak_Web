import { Router } from "express";
import prisma from "../db.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// GET ALL PAGES
router.get("/", async (req, res) => {
  try {
    const statusParam = req.query.status ? String(req.query.status).trim() : "published";
    const q = req.query.q ? String(req.query.q).trim().toLowerCase() : "";

    let isAdmin = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
      if (session && session.expiresAt > new Date()) {
        const role = String(session.user.role).toUpperCase();
        if (role === "ADMIN" || role === "TEAM_LEADER") {
          isAdmin = true;
        }
      }
    }

    const where: any = {};

    if (!isAdmin) {
      where.publicationStatus = "PUBLISHED";
    } else if (statusParam !== "all") {
      where.publicationStatus = statusParam.toUpperCase();
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
      ];
    }

    const pages = await prisma.page.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    res.json(pages);
  } catch (error: any) {
    console.error("GET /pages error:", error);
    res.status(500).json({ message: "Sayfalar alınırken hata oluştu." });
  }
});

// GET PAGE BY SLUG OR ID
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const isNumericId = /^\d+$/.test(slug);

    let isAdmin = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
      if (session && session.expiresAt > new Date()) {
        const role = String(session.user.role).toUpperCase();
        if (role === "ADMIN" || role === "TEAM_LEADER") {
          isAdmin = true;
        }
      }
    }

    const page = isNumericId
      ? await prisma.page.findUnique({ where: { id: parseInt(slug, 10) } })
      : await prisma.page.findUnique({ where: { slug } });

    if (!page) {
      return res.status(404).json({ message: "Sayfa bulunamadı." });
    }

    if (!isAdmin && page.publicationStatus !== "PUBLISHED") {
      return res.status(404).json({ message: "Sayfa bulunamadı." });
    }

    res.json(page);
  } catch (error: any) {
    console.error("GET /pages/:slug error:", error);
    res.status(500).json({ message: "Sayfa detayı alınırken hata oluştu." });
  }
});

// CREATE PAGE (ADMIN)
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      slug: rawSlug,
      shortDescription,
      content,
      publicationStatus,
      isFeatured,
      showInMenu,
      displayOrder,
      metaTitle,
      metaDescription,
    } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Sayfa başlığı zorunludur." });
    }

    let finalSlug = rawSlug ? generateSlug(String(rawSlug)) : generateSlug(String(title));
    if (!finalSlug) {
      finalSlug = `sayfa-${Date.now()}`;
    }

    const existingSlug = await prisma.page.findUnique({ where: { slug: finalSlug } });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const newPage = await prisma.page.create({
      data: {
        title: String(title).trim(),
        slug: finalSlug,
        shortDescription: shortDescription ? String(shortDescription).trim() : null,
        content: content ? String(content) : "",
        publicationStatus: publicationStatus ? String(publicationStatus).toUpperCase() : "PUBLISHED",
        isFeatured: Boolean(isFeatured),
        showInMenu: Boolean(showInMenu),
        displayOrder: typeof displayOrder === "number" ? displayOrder : 0,
        metaTitle: metaTitle ? String(metaTitle).trim() : null,
        metaDescription: metaDescription ? String(metaDescription).trim() : null,
      },
    });

    res.status(201).json(newPage);
  } catch (error: any) {
    console.error("POST /pages error:", error);
    res.status(500).json({ message: "Sayfa oluşturulurken hata oluştu." });
  }
});

// UPDATE PAGE (ADMIN)
router.patch("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Geçersiz sayfa ID." });
    }

    const existingPage = await prisma.page.findUnique({ where: { id } });
    if (!existingPage) {
      return res.status(404).json({ message: "Sayfa bulunamadı." });
    }

    const {
      title,
      slug: rawSlug,
      shortDescription,
      content,
      publicationStatus,
      isFeatured,
      showInMenu,
      displayOrder,
      metaTitle,
      metaDescription,
    } = req.body;

    const data: any = {};

    if (title !== undefined) data.title = String(title).trim();
    if (shortDescription !== undefined) data.shortDescription = shortDescription ? String(shortDescription).trim() : null;
    if (content !== undefined) data.content = String(content);
    if (publicationStatus !== undefined) data.publicationStatus = String(publicationStatus).toUpperCase();
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (showInMenu !== undefined) data.showInMenu = Boolean(showInMenu);
    if (displayOrder !== undefined) data.displayOrder = Number(displayOrder);
    if (metaTitle !== undefined) data.metaTitle = metaTitle ? String(metaTitle).trim() : null;
    if (metaDescription !== undefined) data.metaDescription = metaDescription ? String(metaDescription).trim() : null;

    if (rawSlug && generateSlug(String(rawSlug)) !== existingPage.slug) {
      let updatedSlug = generateSlug(String(rawSlug));
      const conflict = await prisma.page.findFirst({
        where: { slug: updatedSlug, id: { not: id } },
      });
      if (conflict) {
        updatedSlug = `${updatedSlug}-${Date.now().toString().slice(-4)}`;
      }
      data.slug = updatedSlug;
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data,
    });

    res.json(updatedPage);
  } catch (error: any) {
    console.error("PATCH /pages/:id error:", error);
    res.status(500).json({ message: "Sayfa güncellenirken hata oluştu." });
  }
});

// DELETE PAGE (ADMIN)
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Geçersiz sayfa ID." });
    }

    const existingPage = await prisma.page.findUnique({ where: { id } });
    if (!existingPage) {
      return res.status(404).json({ message: "Sayfa bulunamadı." });
    }

    await prisma.page.delete({ where: { id } });

    res.json({ message: "Sayfa başarıyla silindi." });
  } catch (error: any) {
    console.error("DELETE /pages/:id error:", error);
    res.status(500).json({ message: "Sayfa silinirken hata oluştu." });
  }
});

export default router;
