import { Router } from "express";
import prisma from "../db.js";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();

const toPublicMember = (member: any) => ({
  id: member.externalId,
  memberProfileId: member.id,
  name: member.name,
  slug: member.slug || undefined,
  initials: member.initials,
  primaryTeam: member.primaryTeam,
  primaryRole: member.primaryRole,
  isPresident: member.isPresident,
  bio: member.bio || undefined,
  bioEn: member.bioEn || undefined,
  avatar: member.avatar || undefined,
  linkedin: member.linkedin || undefined,
  twitter: member.twitter || undefined,
  github: member.github || undefined,
  instagram: member.instagram || undefined,
  city: member.city || undefined,
  school: member.school || undefined,
  department: member.department || undefined,
  education: member.education || undefined,
  educationEn: member.educationEn || undefined,
  expertise: member.expertise || undefined,
  expertiseEn: member.expertiseEn || undefined,
  responsibilities: member.responsibilities || undefined,
  responsibilitiesEn: member.responsibilitiesEn || undefined,
  userId: member.userId || undefined,

  memberships:
    member.memberships && member.memberships.length > 0
      ? member.memberships.flatMap((m: any) => {
          const mainTeamName = m.team?.title || member.primaryTeam || "Teknoloji Ekibi";
          const isLeader = Boolean(
            m.roleTitle === "Başkan" || (m.isLeader && m.roleTitle?.includes("Başkan"))
          );

          const items: any[] = [
            {
              teamId: m.teamId,
              teamSlug: m.team?.slug,
              team: mainTeamName,
              role: m.roleTitle || member.primaryRole || "Uzman",
              roleTitle: m.roleTitle,
              subRole: undefined,
              isLeader: isLeader,
            },
          ];

          if (m.subRole) {
            const cleanSubTeam = m.subRole
              .replace(" Ekibi", "")
              .replace(" Sorumlusu", "")
              .replace(" Grubu", "")
              .trim();

            items.push({
              teamId: `${m.teamId}-sub`,
              teamSlug: m.team?.slug,
              team: cleanSubTeam || "Web Sitesi",
              role: m.subRole,
              roleTitle: m.subRole,
              subRole: m.subRole,
              isLeader: isLeader,
            });
          }

          return items;
        })
      : [{ team: member.primaryTeam, role: member.primaryRole }],
});

// GET ALL MEMBERS (Supports ?q= search, ?team= filter)
router.get("/", async (req, res) => {
  try {
    const q = req.query.q ? String(req.query.q).trim() : "";
    const teamFilter = req.query.team ? String(req.query.team).trim() : "";

    const where: any = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { primaryRole: { contains: q, mode: "insensitive" } },
        { primaryTeam: { contains: q, mode: "insensitive" } },
      ];
    }

    if (teamFilter && teamFilter !== "all" && teamFilter !== "Tümü") {
      where.memberships = {
        some: {
          team: {
            OR: [
              { title: { contains: teamFilter, mode: "insensitive" } },
              { slug: { contains: teamFilter, mode: "insensitive" } },
            ],
          },
        },
      };
    }

    const members = await prisma.memberProfile.findMany({
      where,
      orderBy: { createdAt: "asc" },
      include: {
        memberships: {
          include: {
            team: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: members.map(toPublicMember),
    });
  } catch (error: any) {
    console.error("MEMBERS GET ERROR:", error);
    res.status(500).json({ success: false, error: "Üyeler getirilemedi." });
  }
});

// GET MEMBER BY ID
router.get("/:id", async (req, res) => {
  try {
    const externalId = req.params.id;
    const member = await prisma.memberProfile.findFirst({
      where: {
        OR: [
          { externalId },
          { id: Number(externalId) || -1 },
        ],
      },
      include: {
        memberships: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ success: false, error: "Üye bulunamadı." });
    }

    res.json({
      success: true,
      data: toPublicMember(member),
    });
  } catch (error) {
    console.error("MEMBER BY ID GET ERROR:", error);
    res.status(500).json({ success: false, error: "Üye alınamadı." });
  }
});

// CREATE MEMBER
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const body = req.body;
    const externalId = body.id || `m-${Date.now()}`;
    const name = String(body.name || "").trim();

    if (!name) {
      return res.status(400).json({ success: false, error: "Üye adı zorunludur." });
    }

    const member = await prisma.$transaction(async (tx) => {
      const created = await tx.memberProfile.upsert({
        where: { externalId },
        update: {
          name,
          initials: body.initials || name.substring(0, 2).toUpperCase(),
          primaryTeam: body.primaryTeam || "Teknoloji Ekibi",
          primaryRole: body.primaryRole || "Üye",
          isPresident: Boolean(body.isPresident),
          bio: body.bio || null,
          avatar: body.avatar || null,
          linkedin: body.linkedin || null,
          city: body.city || null,
          school: body.school || null,
          department: body.department || null,
        },
        create: {
          externalId,
          name,
          initials: body.initials || name.substring(0, 2).toUpperCase(),
          primaryTeam: body.primaryTeam || "Teknoloji Ekibi",
          primaryRole: body.primaryRole || "Üye",
          isPresident: Boolean(body.isPresident),
          bio: body.bio || null,
          avatar: body.avatar || null,
          linkedin: body.linkedin || null,
          city: body.city || null,
          school: body.school || null,
          department: body.department || null,
        },
      });

      // Update Team Memberships if provided
      if (Array.isArray(body.memberships)) {
        for (const mem of body.memberships) {
          const teamSlugOrId = mem.teamSlug || mem.teamId || mem.team;
          let team = await tx.team.findFirst({
            where: {
              OR: [
                { slug: String(teamSlugOrId) },
                { externalId: String(teamSlugOrId) },
                { title: { contains: String(mem.team || ""), mode: "insensitive" } },
              ],
            },
          });

          if (!team && mem.team) {
            const teamTitle = String(mem.team).trim();
            const generatedSlug = teamTitle
              .toLowerCase()
              .replace(/ğ/g, "g")
              .replace(/ü/g, "u")
              .replace(/ş/g, "s")
              .replace(/ı/g, "i")
              .replace(/ö/g, "o")
              .replace(/ç/g, "c")
              .replace(/[^a-z0-9]/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, "");

            team = await tx.team.create({
              data: {
                externalId: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                slug: generatedSlug || `team-${Date.now()}`,
                title: teamTitle,
                shortDescription: `${teamTitle} çalışma grubu.`,
                about: `${teamTitle} hakkında detaylı bilgi.`,
                bgImage: "/images/istockphoto-1173149385-612x612.jpg",
                structure: "Gençlik Topluluğu Çalışma Grubu",
              },
            });
          }

          if (team) {
            const isL = mem.role === "Başkan" || (Boolean(mem.isLeader) && mem.role?.includes("Başkan"));
            await tx.teamMembership.upsert({
              where: {
                memberId_teamId: {
                  memberId: created.id,
                  teamId: team.id,
                },
              },
              update: {
                roleTitle: mem.role || "Üye",
                subRole: mem.subRole || null,
                isLeader: isL,
              },
              create: {
                memberId: created.id,
                teamId: team.id,
                roleTitle: mem.role || "Üye",
                subRole: mem.subRole || null,
                isLeader: isL,
              },
            });

            if (isL) {
              await tx.team.update({
                where: { id: team.id },
                data: { leaderId: created.id },
              });
            }
          }
        }
      }

      return tx.memberProfile.findUnique({
        where: { id: created.id },
        include: {
          memberships: {
            include: { team: true },
          },
        },
      });
    });

    res.status(201).json({ success: true, data: toPublicMember(member) });
  } catch (error: any) {
    console.error("MEMBERS POST ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Üye oluşturulamadı." });
  }
});

// UPDATE MEMBER
router.patch("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const externalId = String(req.params.id);
    const body = req.body;

    const existingMember = await prisma.memberProfile.findFirst({
      where: {
        OR: [
          { externalId },
          { id: Number(externalId) || -1 },
        ],
      },
    });

    if (!existingMember) {
      return res.status(404).json({ success: false, error: "Güncellenecek üye bulunamadı." });
    }

    const member = await prisma.$transaction(async (tx) => {
      const dataToUpdate: any = {};

      if (body.name !== undefined) dataToUpdate.name = String(body.name).trim();
      if (body.slug !== undefined) dataToUpdate.slug = body.slug;
      if (body.initials !== undefined) dataToUpdate.initials = body.initials;
      if (body.primaryTeam !== undefined) dataToUpdate.primaryTeam = body.primaryTeam;
      if (body.primaryRole !== undefined) dataToUpdate.primaryRole = body.primaryRole;
      if (body.isPresident !== undefined) dataToUpdate.isPresident = Boolean(body.isPresident);
      if (body.bio !== undefined) dataToUpdate.bio = body.bio;
      if (body.bioEn !== undefined) dataToUpdate.bioEn = body.bioEn;
      if (body.avatar !== undefined) dataToUpdate.avatar = body.avatar;
      if (body.linkedin !== undefined) dataToUpdate.linkedin = body.linkedin;
      if (body.twitter !== undefined) dataToUpdate.twitter = body.twitter;
      if (body.github !== undefined) dataToUpdate.github = body.github;
      if (body.instagram !== undefined) dataToUpdate.instagram = body.instagram;
      if (body.city !== undefined) dataToUpdate.city = body.city;
      if (body.school !== undefined) dataToUpdate.school = body.school;
      if (body.department !== undefined) dataToUpdate.department = body.department;
      if (body.education !== undefined) dataToUpdate.education = body.education;
      if (body.educationEn !== undefined) dataToUpdate.educationEn = body.educationEn;
      if (body.expertise !== undefined) dataToUpdate.expertise = body.expertise;
      if (body.expertiseEn !== undefined) dataToUpdate.expertiseEn = body.expertiseEn;
      if (body.responsibilities !== undefined) dataToUpdate.responsibilities = body.responsibilities;
      if (body.responsibilitiesEn !== undefined) dataToUpdate.responsibilitiesEn = body.responsibilitiesEn;


      const updated = await tx.memberProfile.update({
        where: { id: existingMember.id },
        data: dataToUpdate,
      });

      // Update Team Memberships if provided
      if (Array.isArray(body.memberships)) {
        for (const mem of body.memberships) {
          const teamSlugOrId = mem.teamSlug || mem.teamId || mem.team;
          let team = await tx.team.findFirst({
            where: {
              OR: [
                { slug: String(teamSlugOrId) },
                { externalId: String(teamSlugOrId) },
                { title: { contains: String(mem.team || ""), mode: "insensitive" } },
              ],
            },
          });

          if (!team && mem.team) {
            const teamTitle = String(mem.team).trim();
            const generatedSlug = teamTitle
              .toLowerCase()
              .replace(/ğ/g, "g")
              .replace(/ü/g, "u")
              .replace(/ş/g, "s")
              .replace(/ı/g, "i")
              .replace(/ö/g, "o")
              .replace(/ç/g, "c")
              .replace(/[^a-z0-9]/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, "");

            team = await tx.team.create({
              data: {
                externalId: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                slug: generatedSlug || `team-${Date.now()}`,
                title: teamTitle,
                shortDescription: `${teamTitle} çalışma grubu.`,
                about: `${teamTitle} hakkında detaylı bilgi.`,
                bgImage: "/images/istockphoto-1173149385-612x612.jpg",
                structure: "Gençlik Topluluğu Çalışma Grubu",
              },
            });
          }

          if (team) {
            const isL = mem.role === "Başkan" || (Boolean(mem.isLeader) && mem.role?.includes("Başkan"));
            await tx.teamMembership.upsert({
              where: {
                memberId_teamId: {
                  memberId: updated.id,
                  teamId: team.id,
                },
              },
              update: {
                roleTitle: mem.role || "Üye",
                subRole: mem.subRole || null,
                isLeader: isL,
              },
              create: {
                memberId: updated.id,
                teamId: team.id,
                roleTitle: mem.role || "Üye",
                subRole: mem.subRole || null,
                isLeader: isL,
              },
            });

            if (isL) {
              await tx.team.update({
                where: { id: team.id },
                data: { leaderId: updated.id },
              });
            }
          }
        }
      }

      return tx.memberProfile.findUnique({
        where: { id: updated.id },
        include: {
          memberships: {
            include: { team: true },
          },
        },
      });
    });

    res.json({ success: true, data: toPublicMember(member) });
  } catch (error: any) {
    console.error("MEMBERS PATCH ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Üye güncellenemedi." });
  }
});

// DELETE MEMBER (Deletes MemberProfile & TeamMemberships in transaction, preserves User record!)
router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const externalId = String(req.params.id);

    const existingMember = await prisma.memberProfile.findFirst({
      where: {
        OR: [
          { externalId },
          { id: Number(externalId) || -1 },
        ],
      },
    });

    if (!existingMember) {
      return res.status(404).json({ success: false, error: "Silinecek üye bulunamadı." });
    }

    await prisma.$transaction(async (tx) => {
      // Unset leaderId on any teams led by this member
      await tx.team.updateMany({
        where: { leaderId: existingMember.id },
        data: { leaderId: null },
      });

      // Delete all team memberships for this member
      await tx.teamMembership.deleteMany({
        where: { memberId: existingMember.id },
      });

      // Delete MemberProfile (User account remains intact)
      await tx.memberProfile.delete({
        where: { id: existingMember.id },
      });
    });

    res.json({ success: true, message: "Üye profili ve üyelikleri başarıyla silindi." });
  } catch (error: any) {
    console.error("MEMBERS DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Üye silinemedi." });
  }
});

export default router;
