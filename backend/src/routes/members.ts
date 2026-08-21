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

const toPublicMember = (member: any) => ({
  id: member.externalId,
  name: member.name,
  initials: member.initials,
  primaryTeam: member.primaryTeam,
  primaryRole: member.primaryRole,
  memberships: member.memberships,
  isPresident: member.isPresident,
});

router.get("/", async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: members.map(toPublicMember),
    });
  } catch (error) {
    console.error("MEMBERS GET ERROR:", error);
    res.status(500).json({ success: false, error: "Üyeler getirilemedi." });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const externalId = body.id || `m-${Date.now()}`;
    const name = String(body.name || "").trim();

    if (!name) {
      return res.status(400).json({ success: false, error: "Üye adı zorunludur." });
    }

    const member = await prisma.member.upsert({
      where: { externalId },
      update: {
        name,
        initials: body.initials || name.substring(0, 2).toUpperCase(),
        primaryTeam: body.primaryTeam || "Teknoloji Ekibi",
        primaryRole: body.primaryRole || "Üye",
        memberships: Array.isArray(body.memberships) ? body.memberships : [],
        isPresident: Boolean(body.isPresident),
      },
      create: {
        externalId,
        name,
        initials: body.initials || name.substring(0, 2).toUpperCase(),
        primaryTeam: body.primaryTeam || "Teknoloji Ekibi",
        primaryRole: body.primaryRole || "Üye",
        memberships: Array.isArray(body.memberships) ? body.memberships : [],
        isPresident: Boolean(body.isPresident),
      },
    });

    res.status(201).json({ success: true, data: toPublicMember(member) });
  } catch (error) {
    console.error("MEMBERS POST ERROR:", error);
    res.status(500).json({ success: false, error: "Üye oluşturulamadı." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const externalId = req.params.id;
    const body = req.body;
    const data: any = {};

    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.initials !== undefined) data.initials = body.initials;
    if (body.primaryTeam !== undefined) data.primaryTeam = body.primaryTeam;
    if (body.primaryRole !== undefined) data.primaryRole = body.primaryRole;
    if (body.memberships !== undefined) {
      data.memberships = Array.isArray(body.memberships) ? body.memberships : [];
    }
    if (body.isPresident !== undefined) data.isPresident = Boolean(body.isPresident);

    const member = await prisma.member.upsert({
      where: { externalId },
      update: data,
      create: {
        externalId,
        name: data.name || "Yeni Üye",
        initials: data.initials || (data.name || "YÜ").substring(0, 2).toUpperCase(),
        primaryTeam: data.primaryTeam || "Teknoloji Ekibi",
        primaryRole: data.primaryRole || "Üye",
        memberships: data.memberships || [],
        isPresident: data.isPresident || false,
      },
    });

    res.json({ success: true, data: toPublicMember(member) });
  } catch (error) {
    console.error("MEMBERS PATCH ERROR:", error);
    res.status(500).json({ success: false, error: "Üye güncellenemedi." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.member.delete({
      where: { externalId: req.params.id },
    });

    res.json({ success: true, message: "Üye silindi." });
  } catch (error) {
    console.error("MEMBERS DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Üye silinemedi." });
  }
});

export default router;
