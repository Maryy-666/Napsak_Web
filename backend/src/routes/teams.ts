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

const toTeamData = (team: any) => ({
  id: team.externalId,
  slug: team.slug,
  title: team.title,
  shortDescription: team.shortDescription,
  iconName: team.iconName,
  bgImage: team.bgImage,
  about: team.about,
  focusAreas: team.focusAreas,
  whatWeDo: team.whatWeDo,
  structure: team.structure,
  featuredSectionImage: team.featuredSectionImage || undefined,
  galleryTitle: team.galleryTitle || undefined,
  gallery: team.gallery || undefined,
});

router.get("/", async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { createdAt: "asc" },
    });

    res.json({
      success: true,
      data: teams.map(toTeamData),
    });
  } catch (error) {
    console.error("TEAMS GET ERROR:", error);
    res.status(500).json({ success: false, error: "Ekipler getirilemedi." });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const slug = body.slug || body.id || `team-${Date.now()}`;
    const externalId = body.id || slug;
    const title = String(body.title || "").trim();

    if (!title) {
      return res.status(400).json({ success: false, error: "Ekip adı zorunludur." });
    }

    const team = await prisma.team.upsert({
      where: { externalId },
      update: {
        slug,
        title,
        shortDescription: body.shortDescription || "Ekip açıklaması.",
        iconName: body.iconName || "cpu",
        bgImage: body.bgImage || "/images/istockphoto-1173149385-612x612.jpg",
        about: body.about || "Ekip hakkında detaylı bilgi.",
        focusAreas: Array.isArray(body.focusAreas) ? body.focusAreas : [],
        whatWeDo: Array.isArray(body.whatWeDo) ? body.whatWeDo : [],
        structure: body.structure || "Esnek çalışma modeli",
        featuredSectionImage: body.featuredSectionImage || null,
        galleryTitle: body.galleryTitle || null,
        gallery: Array.isArray(body.gallery) ? body.gallery : null,
      },
      create: {
        externalId,
        slug,
        title,
        shortDescription: body.shortDescription || "Ekip açıklaması.",
        iconName: body.iconName || "cpu",
        bgImage: body.bgImage || "/images/istockphoto-1173149385-612x612.jpg",
        about: body.about || "Ekip hakkında detaylı bilgi.",
        focusAreas: Array.isArray(body.focusAreas) ? body.focusAreas : [],
        whatWeDo: Array.isArray(body.whatWeDo) ? body.whatWeDo : [],
        structure: body.structure || "Esnek çalışma modeli",
        featuredSectionImage: body.featuredSectionImage || null,
        galleryTitle: body.galleryTitle || null,
        gallery: Array.isArray(body.gallery) ? body.gallery : null,
      },
    });

    res.status(201).json({ success: true, data: toTeamData(team) });
  } catch (error) {
    console.error("TEAMS POST ERROR:", error);
    res.status(500).json({ success: false, error: "Ekip oluşturulamadı." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const body = req.body;
    const data: any = {};

    if (body.slug !== undefined) data.slug = body.slug;
    if (body.title !== undefined) data.title = String(body.title).trim();
    if (body.shortDescription !== undefined) data.shortDescription = body.shortDescription;
    if (body.iconName !== undefined) data.iconName = body.iconName;
    if (body.bgImage !== undefined) data.bgImage = body.bgImage;
    if (body.about !== undefined) data.about = body.about;
    if (body.focusAreas !== undefined) data.focusAreas = Array.isArray(body.focusAreas) ? body.focusAreas : [];
    if (body.whatWeDo !== undefined) data.whatWeDo = Array.isArray(body.whatWeDo) ? body.whatWeDo : [];
    if (body.structure !== undefined) data.structure = body.structure;
    if (body.featuredSectionImage !== undefined) data.featuredSectionImage = body.featuredSectionImage || null;
    if (body.galleryTitle !== undefined) data.galleryTitle = body.galleryTitle || null;
    if (body.gallery !== undefined) data.gallery = Array.isArray(body.gallery) ? body.gallery : null;

    const externalId = req.params.id;
    const team = await prisma.team.upsert({
      where: { externalId },
      update: data,
      create: {
        externalId,
        slug: data.slug || externalId,
        title: data.title || "Yeni Ekip",
        shortDescription: data.shortDescription || "Ekip açıklaması.",
        iconName: data.iconName || "cpu",
        bgImage: data.bgImage || "/images/istockphoto-1173149385-612x612.jpg",
        about: data.about || "Ekip hakkında detaylı bilgi.",
        focusAreas: data.focusAreas || [],
        whatWeDo: data.whatWeDo || [],
        structure: data.structure || "Esnek çalışma modeli",
        featuredSectionImage: data.featuredSectionImage || null,
        galleryTitle: data.galleryTitle || null,
        gallery: data.gallery || null,
      },
    });

    res.json({ success: true, data: toTeamData(team) });
  } catch (error) {
    console.error("TEAMS PATCH ERROR:", error);
    res.status(500).json({ success: false, error: "Ekip güncellenemedi." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.team.delete({
      where: { externalId: req.params.id },
    });

    res.json({ success: true, message: "Ekip silindi." });
  } catch (error) {
    console.error("TEAMS DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Ekip silinemedi." });
  }
});

export default router;
