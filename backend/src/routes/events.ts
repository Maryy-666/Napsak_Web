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

const formatEvent = (event: any) => {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : start;

  let computedStatus = event.status || "Yaklaşan";
  if (end < now) {
    computedStatus = "Geçmiş";
  } else if (start <= now && end >= now) {
    computedStatus = "Devam Ediyor";
  } else {
    computedStatus = "Yaklaşan";
  }

  const appCount = event.eventApplications ? event.eventApplications.length : 0;

  return {
    id: event.id,
    externalId: String(event.id),
    slug: event.slug || `etkinlik-${event.id}`,
    title: event.title,
    shortDescription: event.shortDescription || event.description || "",
    description: event.description || "",
    content: event.content || event.description || "",
    category: event.category || "programlar",
    location: event.location || "Belirtilmedi",
    status: computedStatus,
    publicationStatus: event.publicationStatus || "PUBLISHED",
    image: event.image || undefined,
    coverImage: event.image || undefined,
    capacity: event.capacity ?? 100,
    appliedCount: appCount,
    isFeatured: Boolean(event.isFeatured),
    registrationEnabled: Boolean(event.registrationEnabled ?? true),
    registrationDeadline: event.registrationDeadline ? event.registrationDeadline.toISOString() : undefined,
    displayOrder: event.displayOrder || 0,
    targetAudience: event.targetAudience || undefined,
    startDate: event.startDate ? event.startDate.toISOString() : new Date().toISOString(),
    endDate: event.endDate ? event.endDate.toISOString() : undefined,
    createdAt: event.createdAt ? event.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: event.updatedAt ? event.updatedAt.toISOString() : new Date().toISOString(),
  };
};

// GET ALL EVENTS
// Public website gets ONLY PUBLISHED events (status !== DRAFT and !== ARCHIVED).
// Admin can request status=all, status=DRAFT, etc. (requires authentication check if requesting drafts).
router.get("/", async (req, res) => {
  try {
    const statusParam = req.query.status ? String(req.query.status).trim() : "PUBLISHED";
    const categoryParam = req.query.category ? String(req.query.category).trim() : "";
    const isFeaturedParam = req.query.isFeatured;
    const q = req.query.q ? String(req.query.q).trim() : "";

    const where: any = {};

    // Authorization check for non-published events
    if (statusParam === "all" || statusParam === "DRAFT" || statusParam === "ARCHIVED") {
      // Require admin authentication to view draft or archived events
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // Fall back to PUBLISHED only for public requests
        where.publicationStatus = "PUBLISHED";
      } else {
        // Authenticate request
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

    if (categoryParam && categoryParam !== "all" && categoryParam !== "Tümü") {
      where.category = categoryParam;
    }

    if (isFeaturedParam === "true") {
      where.isFeatured = true;
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { displayOrder: "asc" },
        { startDate: "asc" },
      ],
      include: {
        eventApplications: true,
      },
    });

    res.json({
      success: true,
      data: events.map(formatEvent),
    });
  } catch (error: any) {
    console.error("EVENTS GET ERROR:", error);
    res.status(500).json({ success: false, error: "Etkinlikler getirilemedi." });
  }
});

// GET EVENT BY SLUG OR ID
router.get("/:slug", async (req, res) => {
  try {
    const param = req.params.slug;
    const numericId = Number(param);

    const event = await prisma.event.findFirst({
      where: {
        OR: [
          { slug: param },
          ...(Number.isInteger(numericId) ? [{ id: numericId }] : []),
        ],
      },
      include: {
        eventApplications: true,
      },
    });

    if (!event) {
      return res.status(404).json({ success: false, error: "Etkinlik bulunamadı." });
    }

    // Protect DRAFT / ARCHIVED events from public access
    if (event.publicationStatus !== "PUBLISHED") {
      const authHeader = req.headers.authorization;
      let isAdmin = false;

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const session = await prisma.session.findUnique({
          where: { token },
          include: { user: true },
        });
        if (session && session.user.role === "ADMIN") {
          isAdmin = true;
        }
      }

      if (!isAdmin) {
        return res.status(404).json({ success: false, error: "Etkinlik bulunamadı." });
      }
    }

    res.json({
      success: true,
      data: formatEvent(event),
    });
  } catch (error: any) {
    console.error("EVENT BY SLUG GET ERROR:", error);
    res.status(500).json({ success: false, error: "Etkinlik detayı alınamadı." });
  }
});

// CREATE EVENT (ADMIN ONLY)
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const body = req.body;
    const title = String(body.title || "").trim();

    if (!title) {
      return res.status(400).json({ success: false, error: "Etkinlik başlığı zorunludur." });
    }

    if (!body.startDate) {
      return res.status(400).json({ success: false, error: "Başlangıç tarihi zorunludur." });
    }

    const startDate = new Date(body.startDate);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ success: false, error: "Geçersiz başlangıç tarihi." });
    }

    let endDate: Date | null = null;
    if (body.endDate) {
      endDate = new Date(body.endDate);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({ success: false, error: "Geçersiz bitiş tarihi." });
      }
      if (endDate < startDate) {
        return res.status(400).json({ success: false, error: "Bitiş tarihi başlangıç tarihinden önce olamaz." });
      }
    }

    if (body.capacity !== undefined && body.capacity !== null && body.capacity !== "") {
      const cap = Number(body.capacity);
      if (isNaN(cap) || cap < 1) {
        return res.status(400).json({ success: false, error: "Kontenjan 1 veya daha büyük olmalıdır." });
      }
    }

    // Slug management & uniqueness
    let slug = body.slug ? toSlug(body.slug) : toSlug(title);
    if (!slug) slug = `etkinlik-${Date.now()}`;

    const existingSlug = await prisma.event.findFirst({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const pubStatus = body.publicationStatus || (body.status === "taslak" ? "DRAFT" : "PUBLISHED");

    const event = await prisma.event.create({
      data: {
        slug,
        title,
        shortDescription: body.shortDescription || body.description || null,
        description: body.description || null,
        content: body.content || body.description || null,
        category: body.category || "programlar",
        location: body.location || "Online",
        status: body.status || "Yaklaşan",
        publicationStatus: pubStatus,
        image: body.image || body.coverImage || null,
        capacity: body.capacity ? Number(body.capacity) : 100,
        targetAudience: body.targetAudience || null,
        isFeatured: Boolean(body.isFeatured),
        registrationEnabled: body.registrationEnabled !== undefined ? Boolean(body.registrationEnabled) : true,
        registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : null,
        displayOrder: body.displayOrder ? Number(body.displayOrder) : 0,
        startDate,
        endDate,
      },
      include: {
        eventApplications: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Etkinlik başarıyla oluşturuldu.",
      data: formatEvent(event),
    });
  } catch (error: any) {
    console.error("EVENTS POST ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Etkinlik oluşturulamadı." });
  }
});

// UPDATE EVENT (ADMIN ONLY)
router.patch("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const paramStr = String(req.params.id);
    const numId = Number(paramStr);

    const orConditions: any[] = [{ slug: paramStr }];
    if (Number.isInteger(numId) && numId > 0) {
      orConditions.push({ id: numId });
    }

    const existingEvent = await prisma.event.findFirst({
      where: { OR: orConditions },
    });

    if (!existingEvent) {
      return res.status(404).json({ success: false, error: "Güncellenecek etkinlik bulunamadı." });
    }

    const body = req.body;
    const dataToUpdate: any = {};

    if (body.title !== undefined) {
      const t = String(body.title).trim();
      if (!t) return res.status(400).json({ success: false, error: "Etkinlik başlığı boş olamaz." });
      dataToUpdate.title = t;
    }

    if (body.slug !== undefined && body.slug !== existingEvent.slug) {
      const newSlug = toSlug(body.slug);
      const slugCheck = await prisma.event.findFirst({
        where: { slug: newSlug, id: { not: existingEvent.id } },
      });
      if (slugCheck) {
        return res.status(400).json({ success: false, error: "Bu slug başka bir etkinlik tarafından kullanılıyor." });
      }
      dataToUpdate.slug = newSlug;
    }

    let checkStart = body.startDate ? new Date(body.startDate) : existingEvent.startDate;
    let checkEnd = body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : existingEvent.endDate;

    if (body.startDate !== undefined) {
      const sDate = new Date(body.startDate);
      if (isNaN(sDate.getTime())) {
        return res.status(400).json({ success: false, error: "Geçersiz başlangıç tarihi." });
      }
      dataToUpdate.startDate = sDate;
      checkStart = sDate;
    }

    if (body.endDate !== undefined) {
      if (body.endDate) {
        const eDate = new Date(body.endDate);
        if (isNaN(eDate.getTime())) {
          return res.status(400).json({ success: false, error: "Geçersiz bitiş tarihi." });
        }
        dataToUpdate.endDate = eDate;
        checkEnd = eDate;
      } else {
        dataToUpdate.endDate = null;
        checkEnd = null;
      }
    }

    if (checkEnd && checkEnd < checkStart) {
      return res.status(400).json({ success: false, error: "Bitiş tarihi başlangıç tarihinden önce olamaz." });
    }

    if (body.capacity !== undefined) {
      if (body.capacity !== null && body.capacity !== "") {
        const cap = Number(body.capacity);
        if (isNaN(cap) || cap < 1) {
          return res.status(400).json({ success: false, error: "Kontenjan 1 veya daha büyük olmalıdır." });
        }
        dataToUpdate.capacity = cap;
      } else {
        dataToUpdate.capacity = null;
      }
    }

    if (body.shortDescription !== undefined) dataToUpdate.shortDescription = body.shortDescription;
    if (body.description !== undefined) dataToUpdate.description = body.description;
    if (body.content !== undefined) dataToUpdate.content = body.content;
    if (body.category !== undefined) dataToUpdate.category = body.category;
    if (body.location !== undefined) dataToUpdate.location = body.location;
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.publicationStatus !== undefined) dataToUpdate.publicationStatus = body.publicationStatus;
    if (body.image !== undefined) dataToUpdate.image = body.image || null;
    if (body.coverImage !== undefined) dataToUpdate.image = body.coverImage || null;
    if (body.isFeatured !== undefined) dataToUpdate.isFeatured = Boolean(body.isFeatured);
    if (body.registrationEnabled !== undefined) dataToUpdate.registrationEnabled = Boolean(body.registrationEnabled);
    if (body.registrationDeadline !== undefined) {
      dataToUpdate.registrationDeadline = body.registrationDeadline ? new Date(body.registrationDeadline) : null;
    }
    if (body.displayOrder !== undefined) dataToUpdate.displayOrder = Number(body.displayOrder);

    const updatedEvent = await prisma.event.update({
      where: { id: existingEvent.id },
      data: dataToUpdate,
      include: {
        eventApplications: true,
      },
    });

    res.json({
      success: true,
      message: "Etkinlik başarıyla güncellendi.",
      data: formatEvent(updatedEvent),
    });
  } catch (error: any) {
    console.error("EVENTS PATCH ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Etkinlik güncellenemedi." });
  }
});

// DELETE EVENT (ADMIN ONLY - SAFE DELETION POLICY)
// If event has applications: Soft delete by setting publicationStatus = "ARCHIVED" to preserve historical data.
// If event has NO applications: Hard delete event record.
router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const paramStr = String(req.params.id);
    const numId = Number(paramStr);

    const orConditions: any[] = [{ slug: paramStr }];
    if (Number.isInteger(numId) && numId > 0) {
      orConditions.push({ id: numId });
    }

    const event = await prisma.event.findFirst({
      where: { OR: orConditions },
      include: {
        eventApplications: true,
      },
    });

    if (!event) {
      return res.status(404).json({ success: false, error: "Silinecek etkinlik bulunamadı." });
    }

    if (event.eventApplications && event.eventApplications.length > 0) {
      // Safe Archive Policy to protect existing applications
      await prisma.event.update({
        where: { id: event.id },
        data: { publicationStatus: "ARCHIVED" },
      });

      return res.json({
        success: true,
        archived: true,
        message: "Etkinliğe ait geçmiş başvurular bulunduğu için etkinlik silinmedi, ARCHIVED (arşiv) durumuna alındı.",
      });
    }

    // Hard delete if no applications attached
    await prisma.event.delete({
      where: { id: event.id },
    });

    res.json({
      success: true,
      deleted: true,
      message: "Etkinlik veritabanından güvenle silindi.",
    });
  } catch (error: any) {
    console.error("EVENTS DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Etkinlik silinemedi." });
  }
});

export default router;
