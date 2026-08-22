import { Router } from "express";
import prisma from "../db.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

const VALID_TARGET_TYPES = ["PAGE", "CUSTOM_URL", "DROPDOWN_PARENT"];
const VALID_LOCATIONS = ["NAVBAR", "FOOTER", "BOTH"];

// Helper to detect circular hierarchy when setting parentId
const isCircularParent = async (itemId: number, targetParentId: number): Promise<boolean> => {
  if (itemId === targetParentId) return true;
  let currentParentId: number | null = targetParentId;

  while (currentParentId) {
    if (currentParentId === itemId) return true;
    const parentItem: any = await prisma.navigationItem.findUnique({
      where: { id: currentParentId },
      select: { parentId: true },
    });
    currentParentId = parentItem ? parentItem.parentId : null;
  }

  return false;
};

// GET ALL NAVIGATION ITEMS (Structured for Navbar & Footer)
router.get("/", async (req, res) => {
  try {
    const locationParam = req.query.location ? String(req.query.location).trim().toUpperCase() : undefined;
    const statusParam = req.query.status ? String(req.query.status).trim() : "visible";

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
      where.isVisible = true;
    } else if (statusParam !== "all") {
      where.isVisible = statusParam === "visible" || statusParam === "true";
    }

    if (locationParam && VALID_LOCATIONS.includes(locationParam)) {
      if (locationParam === "NAVBAR") {
        where.location = { in: ["NAVBAR", "BOTH"] };
      } else if (locationParam === "FOOTER") {
        where.location = { in: ["FOOTER", "BOTH"] };
      }
    }

    const allItems = await prisma.navigationItem.findMany({
      where,
      include: {
        page: {
          select: {
            id: true,
            slug: true,
            title: true,
            publicationStatus: true,
          },
        },
      },
      orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
    });

    // Build hierarchy (Top level items with children)
    const itemMap = new Map<number, any>();
    allItems.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    const rootItems: any[] = [];

    allItems.forEach((item) => {
      const mapped = itemMap.get(item.id);
      if (item.parentId && itemMap.has(item.parentId)) {
        itemMap.get(item.parentId).children.push(mapped);
      } else {
        rootItems.push(mapped);
      }
    });

    res.json({
      all: allItems,
      tree: rootItems,
      navbar: rootItems.filter((i) => i.location === "NAVBAR" || i.location === "BOTH"),
      footer: rootItems.filter((i) => i.location === "FOOTER" || i.location === "BOTH"),
    });
  } catch (error: any) {
    console.error("GET /navigation error:", error);
    res.status(500).json({ message: "Menü öğeleri alınırken hata oluştu." });
  }
});

// REORDER NAVIGATION ITEMS (ADMIN)
router.patch("/reorder", authenticate, requireAdmin, async (req, res) => {
  try {
    const { items } = req.body; // Array of { id: number, displayOrder: number }
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Geçersiz sıralama verisi." });
    }

    for (const item of items) {
      if (item.id && typeof item.displayOrder === "number") {
        await prisma.navigationItem.update({
          where: { id: Number(item.id) },
          data: { displayOrder: Math.max(0, Number(item.displayOrder)) },
        });
      }
    }

    res.json({ message: "Menü sıralaması başarıyla güncellendi." });
  } catch (error: any) {
    console.error("PATCH /navigation/reorder error:", error);
    res.status(500).json({ message: "Menü sıralaması güncellenirken hata oluştu." });
  }
});

// CREATE NAVIGATION ITEM (ADMIN)
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      label,
      targetType = "PAGE",
      href,
      pageId,
      parentId,
      location = "NAVBAR",
      displayOrder = 0,
      isVisible = true,
      openInNewTab = false,
    } = req.body;

    if (!label || !String(label).trim()) {
      return res.status(400).json({ message: "Menü başlığı / etiket zorunludur." });
    }

    const uppercaseTargetType = String(targetType).toUpperCase();
    if (!VALID_TARGET_TYPES.includes(uppercaseTargetType)) {
      return res.status(400).json({ message: "Geçersiz hedef tipi (PAGE, CUSTOM_URL, DROPDOWN_PARENT)." });
    }

    const uppercaseLocation = String(location).toUpperCase();
    if (!VALID_LOCATIONS.includes(uppercaseLocation)) {
      return res.status(400).json({ message: "Geçersiz konum (NAVBAR, FOOTER, BOTH)." });
    }

    let parsedPageId: number | null = pageId ? parseInt(String(pageId), 10) : null;
    let parsedParentId: number | null = parentId ? parseInt(String(parentId), 10) : null;

    if (uppercaseTargetType === "PAGE") {
      if (!parsedPageId) {
        return res.status(400).json({ message: "Sayfa bağlantısı (PAGE) için geçerli bir Sayfa seçimi zorunludur." });
      }
      const pageExists = await prisma.page.findUnique({ where: { id: parsedPageId } });
      if (!pageExists) {
        return res.status(400).json({ message: "Seçilen sayfa bulunamadı." });
      }
    } else if (uppercaseTargetType === "CUSTOM_URL") {
      if (!href || !String(href).trim()) {
        return res.status(400).json({ message: "Özel bağlantı (CUSTOM_URL) için URL adresi zorunludur." });
      }
      parsedPageId = null;
    } else if (uppercaseTargetType === "DROPDOWN_PARENT") {
      parsedPageId = null;
    }

    if (parsedParentId) {
      const parentExists = await prisma.navigationItem.findUnique({ where: { id: parsedParentId } });
      if (!parentExists) {
        return res.status(400).json({ message: "Seçilen üst menü öğesi bulunamadı." });
      }
    }

    const newItem = await prisma.navigationItem.create({
      data: {
        label: String(label).trim(),
        targetType: uppercaseTargetType,
        href: href ? String(href).trim() : null,
        pageId: parsedPageId,
        parentId: parsedParentId,
        location: uppercaseLocation,
        displayOrder: Math.max(0, Number(displayOrder) || 0),
        isVisible: Boolean(isVisible),
        openInNewTab: Boolean(openInNewTab),
      },
      include: {
        page: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    res.status(201).json(newItem);
  } catch (error: any) {
    console.error("POST /navigation error:", error);
    res.status(500).json({ message: "Menü öğesi oluşturulurken hata oluştu." });
  }
});

// UPDATE NAVIGATION ITEM (ADMIN)
router.patch("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Geçersiz menü ögesi ID." });
    }

    const existingItem = await prisma.navigationItem.findUnique({ where: { id } });
    if (!existingItem) {
      return res.status(404).json({ message: "Menü öğesi bulunamadı." });
    }

    const {
      label,
      targetType,
      href,
      pageId,
      parentId,
      location,
      displayOrder,
      isVisible,
      openInNewTab,
    } = req.body;

    const data: any = {};

    if (label !== undefined) data.label = String(label).trim();

    if (targetType !== undefined) {
      const uppercaseTargetType = String(targetType).toUpperCase();
      if (!VALID_TARGET_TYPES.includes(uppercaseTargetType)) {
        return res.status(400).json({ message: "Geçersiz hedef tipi." });
      }
      data.targetType = uppercaseTargetType;
    }

    if (location !== undefined) {
      const uppercaseLocation = String(location).toUpperCase();
      if (!VALID_LOCATIONS.includes(uppercaseLocation)) {
        return res.status(400).json({ message: "Geçersiz konum." });
      }
      data.location = uppercaseLocation;
    }

    if (href !== undefined) data.href = href ? String(href).trim() : null;
    if (displayOrder !== undefined) data.displayOrder = Math.max(0, Number(displayOrder) || 0);
    if (isVisible !== undefined) data.isVisible = Boolean(isVisible);
    if (openInNewTab !== undefined) data.openInNewTab = Boolean(openInNewTab);

    if (pageId !== undefined) {
      data.pageId = pageId ? parseInt(String(pageId), 10) : null;
    }

    if (parentId !== undefined) {
      const parsedParentId = parentId ? parseInt(String(parentId), 10) : null;
      if (parsedParentId) {
        if (parsedParentId === id) {
          return res.status(400).json({ message: "Menü öğesi kendisinin üst menüsü (parent) olamaz." });
        }
        const circular = await isCircularParent(id, parsedParentId);
        if (circular) {
          return res.status(400).json({ message: "Döngüsel üst-alt menü ilişkisi oluşturulamaz." });
        }
      }
      data.parentId = parsedParentId;
    }

    const updatedItem = await prisma.navigationItem.update({
      where: { id },
      data,
      include: {
        page: {
          select: {
            id: true,
            slug: true,
            title: true,
          },
        },
      },
    });

    res.json(updatedItem);
  } catch (error: any) {
    console.error("PATCH /navigation/:id error:", error);
    res.status(500).json({ message: "Menü öğesi güncellenirken hata oluştu." });
  }
});

// DELETE NAVIGATION ITEM (ADMIN)
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Geçersiz menü öğesi ID." });
    }

    const existingItem = await prisma.navigationItem.findUnique({ where: { id } });
    if (!existingItem) {
      return res.status(404).json({ message: "Menü öğesi bulunamadı." });
    }

    await prisma.navigationItem.delete({ where: { id } });

    res.json({ message: "Menü öğesi başarıyla silindi." });
  } catch (error: any) {
    console.error("DELETE /navigation/:id error:", error);
    res.status(500).json({ message: "Menü öğesi silinirken hata oluştu." });
  }
});

export default router;
