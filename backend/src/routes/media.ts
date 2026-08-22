import express from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import prisma from "../db.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { getStorageProvider } from "../storage/StorageProvider.js";

const router = express.Router();

// Memory storage for file inspection before saving to provider
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Max limit 20MB
  },
});

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const EXECUTABLE_EXTENSIONS = [
  ".exe",
  ".bat",
  ".sh",
  ".php",
  ".js",
  ".cmd",
  ".py",
  ".vbs",
  ".pl",
  ".cgi",
  ".jar",
  ".asp",
  ".aspx",
];

function sanitizeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const nameWithoutExt = path.basename(originalName, ext);
  const slugified = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const uniqueId = crypto.randomUUID().substring(0, 8);
  return `${slugified || "media"}-${uniqueId}${ext}`;
}

function getImageDimensions(buffer: Buffer, mimeType: string): { width: number | null; height: number | null } {
  try {
    if (mimeType === "image/png" && buffer.length >= 24) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }
    if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        if (marker === 0xc0 || marker === 0xc2) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        offset += 2 + buffer.readUInt16BE(offset + 2);
      }
    }
  } catch {
    // Graceful fallback if dimension parsing fails
  }
  return { width: null, height: null };
}

// GET /media (List & Filter)
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 24));
    const searchQuery = (req.query.q as string || "").trim();
    const folderFilter = (req.query.folder as string || "").trim();
    const typeFilter = (req.query.type as string || "").trim().toLowerCase();

    const where: any = {
      deletedAt: null,
    };

    if (searchQuery) {
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { originalName: { contains: searchQuery, mode: "insensitive" } },
        { filename: { contains: searchQuery, mode: "insensitive" } },
        { altText: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    if (folderFilter && folderFilter !== "all") {
      where.folder = folderFilter;
    }

    if (typeFilter === "image") {
      where.mimeType = { startsWith: "image/" };
    } else if (typeFilter === "pdf") {
      where.mimeType = "application/pdf";
    }

    const total = await prisma.media.count({ where });
    const totalPages = Math.ceil(total / limit) || 1;

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    res.json({
      media,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error("GET /media error:", error);
    res.status(500).json({ message: "Medya kütüphanesi yüklenirken hata oluştu." });
  }
});

// POST /media/upload (ADMIN ONLY)
router.post("/upload", authenticate, requireAdmin, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Yüklenecek dosya seçilmedi." });
    }

    const folderInput = (req.body.folder as string || "general").trim();

    // 1. Path traversal check in folder
    if (folderInput.includes("..") || folderInput.includes("/") || folderInput.includes("\\")) {
      return res.status(400).json({ message: "Geçersiz klasör adı (Path traversal engellendi)." });
    }

    // 2. MIME type check
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ message: `Desteklenmeyen dosya türü: ${file.mimetype}. İzin verilenler: JPG, PNG, WEBP, GIF, PDF.` });
    }

    // 3. Extension check
    const ext = path.extname(file.originalname).toLowerCase();
    if (EXECUTABLE_EXTENSIONS.includes(ext)) {
      return res.status(400).json({ message: "Güvenlik nedeniyle çalıştırılabilir dosyalar yüklenemez." });
    }

    // 4. Size limits
    let maxAllowedSize = 5 * 1024 * 1024; // Default image: 5MB
    if (file.mimetype === "application/pdf") {
      maxAllowedSize = 20 * 1024 * 1024; // PDF: 20MB
    } else if (folderInput === "avatars") {
      maxAllowedSize = 2 * 1024 * 1024; // Avatar: 2MB
    }

    if (file.size > maxAllowedSize) {
      const maxMb = Math.round(maxAllowedSize / (1024 * 1024));
      return res.status(400).json({ message: `Dosya boyutu sınırı aşıldı (Maksimum ${maxMb} MB).` });
    }

    // 5. Sanitize Filename
    const sanitizedName = sanitizeFilename(file.originalname);
    const storageProvider = getStorageProvider();

    // Upload via Storage Provider
    const uploadResult = await storageProvider.upload(
      file.buffer,
      sanitizedName,
      file.mimetype,
      folderInput
    );

    // Extract image dimensions
    const dimensions = getImageDimensions(file.buffer, file.mimetype);

    // Save Media record in DB (with orphan file cleanup if DB save fails)
    let mediaRecord;
    try {
      mediaRecord = await prisma.media.create({
        data: {
          filename: sanitizedName,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: uploadResult.url,
          folder: folderInput,
          storageKey: uploadResult.key,
          provider: uploadResult.provider,
          width: dimensions.width,
          height: dimensions.height,
          title: req.body.title || path.basename(file.originalname, ext),
          altText: req.body.altText || null,
        },
      });
    } catch (dbError) {
      if (uploadResult?.key) {
        console.warn(`Veritabanı kaydı başarısız oldu. Yüklenen medya temizleniyor: ${uploadResult.key}`);
        await storageProvider.delete(uploadResult.key).catch(() => null);
      }
      throw dbError;
    }

    res.status(201).json(mediaRecord);
  } catch (error: any) {
    console.error("POST /media/upload error:", error);
    res.status(500).json({ message: error?.message || "Dosya yüklenirken bir hata oluştu." });
  }
});

// PATCH /media/:id (ADMIN ONLY - Metadata Update)
router.patch("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Geçersiz medya ID." });
    }

    const existingMedia = await prisma.media.findUnique({ where: { id } });
    if (!existingMedia) {
      return res.status(404).json({ message: "Medya bulunamadı." });
    }

    const { altText, title, folder } = req.body;
    const data: any = {};

    if (altText !== undefined) data.altText = altText ? String(altText).trim() : null;
    if (title !== undefined) data.title = title ? String(title).trim() : null;
    if (folder !== undefined) data.folder = folder ? String(folder).trim() : "general";

    const updatedMedia = await prisma.media.update({
      where: { id },
      data,
    });

    res.json(updatedMedia);
  } catch (error: any) {
    console.error("PATCH /media/:id error:", error);
    res.status(500).json({ message: "Medya bilgileri güncellenirken hata oluştu." });
  }
});

// DELETE /media/:id (ADMIN ONLY - Usage Check & Delete)
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Geçersiz medya ID." });
    }

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return res.status(404).json({ message: "Medya bulunamadı." });
    }

    const targetUrl = media.url;
    const filename = media.filename;

    // Perform Usage Check across all models
    const usageDetails: string[] = [];

    // 1. MemberProfile
    const members = await prisma.memberProfile.findMany({
      where: {
        OR: [{ avatar: targetUrl }, { avatar: { contains: filename } }],
      },
      select: { name: true },
    });
    if (members.length > 0) {
      usageDetails.push(`Üye Profilleri: ${members.map((m) => m.name).join(", ")}`);
    }

    // 2. Team
    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { bgImage: targetUrl },
          { bgImage: { contains: filename } },
          { featuredSectionImage: targetUrl },
          { featuredSectionImage: { contains: filename } },
        ],
      },
      select: { title: true },
    });
    if (teams.length > 0) {
      usageDetails.push(`Ekipler: ${teams.map((t) => t.title).join(", ")}`);
    }

    // 3. Event
    const events = await prisma.event.findMany({
      where: {
        OR: [{ image: targetUrl }, { image: { contains: filename } }],
      },
      select: { title: true },
    });
    if (events.length > 0) {
      usageDetails.push(`Etkinlikler: ${events.map((e) => e.title).join(", ")}`);
    }

    // 4. Activity
    const activities = await prisma.activity.findMany({
      where: {
        OR: [{ image: targetUrl }, { image: { contains: filename } }],
      },
      select: { title: true },
    });
    if (activities.length > 0) {
      usageDetails.push(`Faaliyetler: ${activities.map((a) => a.title).join(", ")}`);
    }

    // 5. Page
    const pages = await prisma.page.findMany({
      where: {
        OR: [
          { featuredImage: targetUrl },
          { featuredImage: { contains: filename } },
          { content: { contains: filename } },
        ],
      },
      select: { title: true },
    });
    if (pages.length > 0) {
      usageDetails.push(`Dinamik Sayfalar: ${pages.map((p) => p.title).join(", ")}`);
    }

    // 6. Report
    const reports = await prisma.report.findMany({
      where: {
        OR: [
          { coverImage: targetUrl },
          { coverImage: { contains: filename } },
          { pdfUrl: targetUrl },
          { pdfUrl: { contains: filename } },
        ],
      },
      select: { title: true },
    });
    if (reports.length > 0) {
      usageDetails.push(`Raporlar: ${reports.map((r) => r.title).join(", ")}`);
    }

    // 7. Magazine
    const magazines = await prisma.magazine.findMany({
      where: {
        OR: [
          { coverImage: targetUrl },
          { coverImage: { contains: filename } },
          { pdfUrl: targetUrl },
          { pdfUrl: { contains: filename } },
        ],
      },
      select: { title: true },
    });
    if (magazines.length > 0) {
      usageDetails.push(`Dergiler: ${magazines.map((m) => m.title).join(", ")}`);
    }

    // 8. News
    const newsList = await prisma.news.findMany({
      where: {
        OR: [
          { coverImage: targetUrl },
          { coverImage: { contains: filename } },
          { content: { contains: filename } },
        ],
      },
      select: { title: true },
    });
    if (newsList.length > 0) {
      usageDetails.push(`Haberler: ${newsList.map((n) => n.title).join(", ")}`);
    }

    // 9. HomepageHero
    const heroes = await prisma.homepageHero.findMany({
      where: {
        OR: [
          { imageUrl: targetUrl },
          { imageUrl: { contains: filename } },
        ],
      },
      select: { title: true },
    });
    if (heroes.length > 0) {
      usageDetails.push(`Ana Sayfa Hero: ${heroes.map((h) => h.title).join(", ")}`);
    }

    // If media is used in any content, block deletion
    if (usageDetails.length > 0) {
      return res.status(400).json({
        message: "Bu medya içeriğinizde aktif olarak kullanıldığı için silinemez.",
        usageDetails,
      });
    }

    // Unused: Delete storage file & DB record
    if (media.storageKey) {
      const storageProvider = getStorageProvider();
      await storageProvider.delete(media.storageKey);
    }

    await prisma.media.delete({ where: { id } });

    res.json({ message: "Medya dosyası veritabanından ve depolamadan silindi." });
  } catch (error: any) {
    console.error("DELETE /media/:id error:", error);
    res.status(500).json({ message: "Medya silinirken hata oluştu." });
  }
});

export default router;
