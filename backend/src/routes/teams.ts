import { Router } from "express";
import prisma from "../db.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

const toTeamData = (team: any) => {
  const leaderObj = team.leader || team.memberships?.find((m: any) => m.isLeader)?.member;

  return {
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
    displayOrder: team.displayOrder || 0,
    isActive: team.isActive ?? true,
    leaderId: leaderObj?.id || undefined,
    leaderName: leaderObj?.name || "Ekip Lideri",
    leaderTitle: "Ekip Lideri",
    leaderAvatar: leaderObj?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    memberCount: team.memberships ? team.memberships.length : 0,
    membersList: team.memberships
      ? team.memberships.map((m: any) => {
          const fullRole = m.subRole ? `${m.roleTitle} & ${m.subRole}` : m.roleTitle;
          const isLeader = Boolean(
            m.isLeader ||
              team.leaderId === m.member?.id ||
              (m.subRole && m.subRole.toLowerCase().includes("sorumlus"))
          );

          return {
            id: m.member?.externalId || `m-${m.id}`,
            memberProfileId: m.member?.id,
            name: m.member?.name || "Üye",
            role: fullRole,
            roleTitle: m.roleTitle,
            subRole: m.subRole || undefined,
            isLeader: isLeader,
            avatar:
              m.member?.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            joinedDate: "Aktif Üye",
          };
        })
      : [],
  };
};

// GET ALL TEAMS
router.get("/", async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        leader: true,
        memberships: {
          include: {
            member: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: teams.map(toTeamData),
    });
  } catch (error: any) {
    console.error("TEAMS GET ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || String(error) });
  }
});

// GET TEAM BY SLUG
router.get("/:slug", async (req, res) => {
  try {
    const slugOrId = req.params.slug;
    const team = await prisma.team.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { externalId: slugOrId }],
      },
      include: {
        leader: true,
        memberships: {
          include: {
            member: true,
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ success: false, error: "Ekip bulunamadı." });
    }

    res.json({
      success: true,
      data: toTeamData(team),
    });
  } catch (error) {
    console.error("TEAM BY SLUG GET ERROR:", error);
    res.status(500).json({ success: false, error: "Ekip detayı alınamadı." });
  }
});

// REORDER TEAMS
router.post("/reorder", async (req, res) => {
  try {
    const { orders } = req.body; // Array of { id: string, displayOrder: number }
    if (!Array.isArray(orders)) {
      return res.status(400).json({ success: false, error: "Geçersiz sıralama verisi." });
    }

    await prisma.$transaction(
      orders.map((item: { id: string; displayOrder: number }) =>
        prisma.team.updateMany({
          where: { OR: [{ externalId: item.id }, { slug: item.id }] },
          data: { displayOrder: Number(item.displayOrder) },
        })
      )
    );

    res.json({ success: true, message: "Ekip sıralaması güncellendi." });
  } catch (error: any) {
    console.error("TEAMS REORDER ERROR:", error);
    res.status(500).json({ success: false, error: "Sıralama güncellenemedi." });
  }
});

// CREATE TEAM
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const slug = body.slug || body.id || `team-${Date.now()}`;
    const externalId = body.id || slug;
    const title = String(body.title || "").trim();

    if (!title) {
      return res.status(400).json({ success: false, error: "Ekip adı zorunludur." });
    }

    // Uniqueness check for slug
    const existingTeam = await prisma.team.findFirst({
      where: {
        AND: [
          { OR: [{ slug }, { externalId }] },
          { externalId: { not: externalId } },
        ],
      },
    });

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        error: "Bu ekip adresi/slug başka bir ekip tarafından kullanılıyor.",
      });
    }

    // Leader lookup
    let leaderProfile: any = null;
    if (body.leaderId) {
      leaderProfile = await prisma.memberProfile.findUnique({
        where: { id: Number(body.leaderId) },
      });
    } else if (body.leaderName) {
      leaderProfile = await prisma.memberProfile.findFirst({
        where: { name: { contains: body.leaderName, mode: "insensitive" } },
      });
    }

    // Transaction for Team creation & Leadership sync
    const team = await prisma.$transaction(async (tx) => {
      const created = await tx.team.upsert({
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
          displayOrder: body.displayOrder ? Number(body.displayOrder) : 99,
          isActive: body.status === "Pasif" ? false : body.isActive ?? true,
          leaderId: leaderProfile?.id || null,
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
          displayOrder: body.displayOrder ? Number(body.displayOrder) : 99,
          isActive: body.status === "Pasif" ? false : body.isActive ?? true,
          leaderId: leaderProfile?.id || null,
        },
      });

      // Synchronize Leader in TeamMembership
      if (leaderProfile) {
        // Unset old leader isLeader flag in this team
        await tx.teamMembership.updateMany({
          where: { teamId: created.id, isLeader: true },
          data: { isLeader: false, roleTitle: "Ekip Üyesi" },
        });

        // Set or create new leader membership
        await tx.teamMembership.upsert({
          where: {
            memberId_teamId: {
              memberId: leaderProfile.id,
              teamId: created.id,
            },
          },
          update: {
            roleTitle: "Başkan",
            isLeader: true,
          },
          create: {
            memberId: leaderProfile.id,
            teamId: created.id,
            roleTitle: "Başkan",
            isLeader: true,
          },
        });
      }

      // Add/Update additional members if provided in membersList
      if (Array.isArray(body.membersList)) {
        for (const mItem of body.membersList) {
          let mProfile: any = null;
          if (mItem.memberProfileId) {
            mProfile = await tx.memberProfile.findUnique({
              where: { id: Number(mItem.memberProfileId) },
            });
          } else if (mItem.id) {
            mProfile = await tx.memberProfile.findUnique({
              where: { externalId: String(mItem.id) },
            });
          } else if (mItem.name) {
            mProfile = await tx.memberProfile.findFirst({
              where: { name: { contains: String(mItem.name), mode: "insensitive" } },
            });
          }

          if (mProfile) {
            const isL = mItem.role === "Başkan" || Boolean(mItem.isLeader);
            await tx.teamMembership.upsert({
              where: {
                memberId_teamId: {
                  memberId: mProfile.id,
                  teamId: created.id,
                },
              },
              update: {
                roleTitle: mItem.role || "Uzman",
                isLeader: isL,
              },
              create: {
                memberId: mProfile.id,
                teamId: created.id,
                roleTitle: mItem.role || "Uzman",
                isLeader: isL,
              },
            });
          }
        }
      }

      return tx.team.findUnique({
        where: { id: created.id },
        include: {
          leader: true,
          memberships: {
            include: { member: true },
          },
        },
      });
    });

    res.status(201).json({ success: true, data: toTeamData(team) });
  } catch (error: any) {
    console.error("TEAMS POST ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Ekip oluşturulamadı." });
  }
});

// UPDATE TEAM
router.patch("/:id", async (req, res) => {
  try {
    const externalId = req.params.id;
    const body = req.body;

    const existingTeam = await prisma.team.findFirst({
      where: { OR: [{ externalId }, { slug: externalId }] },
    });

    if (!existingTeam) {
      return res.status(404).json({ success: false, error: "Güncellenecek ekip bulunamadı." });
    }

    // Check slug uniqueness if slug is being changed
    if (body.slug && body.slug !== existingTeam.slug) {
      const slugCheck = await prisma.team.findFirst({
        where: {
          slug: body.slug,
          id: { not: existingTeam.id },
        },
      });
      if (slugCheck) {
        return res.status(400).json({
          success: false,
          error: "Bu slug başka bir ekip tarafından kullanılıyor.",
        });
      }
    }

    // Leader lookup
    let leaderProfile: any = null;
    let shouldUpdateLeader = false;

    if (body.leaderId !== undefined) {
      shouldUpdateLeader = true;
      if (body.leaderId) {
        leaderProfile = await prisma.memberProfile.findUnique({
          where: { id: Number(body.leaderId) },
        });
      }
    } else if (body.leaderName !== undefined) {
      shouldUpdateLeader = true;
      if (body.leaderName) {
        leaderProfile = await prisma.memberProfile.findFirst({
          where: { name: { contains: body.leaderName, mode: "insensitive" } },
        });
      }
    }

    const team = await prisma.$transaction(async (tx) => {
      const dataToUpdate: any = {};

      if (body.slug !== undefined) dataToUpdate.slug = body.slug;
      if (body.title !== undefined) dataToUpdate.title = String(body.title).trim();
      if (body.shortDescription !== undefined) dataToUpdate.shortDescription = body.shortDescription;
      if (body.iconName !== undefined) dataToUpdate.iconName = body.iconName;
      if (body.bgImage !== undefined) dataToUpdate.bgImage = body.bgImage;
      if (body.about !== undefined) dataToUpdate.about = body.about;
      if (body.focusAreas !== undefined) dataToUpdate.focusAreas = Array.isArray(body.focusAreas) ? body.focusAreas : [];
      if (body.whatWeDo !== undefined) dataToUpdate.whatWeDo = Array.isArray(body.whatWeDo) ? body.whatWeDo : [];
      if (body.structure !== undefined) dataToUpdate.structure = body.structure;
      if (body.featuredSectionImage !== undefined) dataToUpdate.featuredSectionImage = body.featuredSectionImage || null;
      if (body.galleryTitle !== undefined) dataToUpdate.galleryTitle = body.galleryTitle || null;
      if (body.gallery !== undefined) dataToUpdate.gallery = Array.isArray(body.gallery) ? body.gallery : null;
      if (body.displayOrder !== undefined) dataToUpdate.displayOrder = Number(body.displayOrder);
      if (body.status !== undefined) dataToUpdate.isActive = body.status === "Aktif";
      if (body.isActive !== undefined) dataToUpdate.isActive = Boolean(body.isActive);

      if (shouldUpdateLeader) {
        dataToUpdate.leaderId = leaderProfile?.id || null;
      }

      const updated = await tx.team.update({
        where: { id: existingTeam.id },
        data: dataToUpdate,
      });

      // Synchronize Leader in TeamMembership
      if (shouldUpdateLeader) {
        // Unset old leader isLeader flag in this team
        await tx.teamMembership.updateMany({
          where: { teamId: updated.id, isLeader: true },
          data: { isLeader: false, roleTitle: "Ekip Üyesi" },
        });

        if (leaderProfile) {
          // Set or create new leader membership
          await tx.teamMembership.upsert({
            where: {
              memberId_teamId: {
                memberId: leaderProfile.id,
                teamId: updated.id,
              },
            },
            update: {
              roleTitle: "Başkan",
              isLeader: true,
            },
            create: {
              memberId: leaderProfile.id,
              teamId: updated.id,
              roleTitle: "Başkan",
              isLeader: true,
            },
          });
        }
      }

      // Add/Update additional members if provided in membersList
      if (Array.isArray(body.membersList)) {
        for (const mItem of body.membersList) {
          let mProfile: any = null;
          if (mItem.memberProfileId) {
            mProfile = await tx.memberProfile.findUnique({
              where: { id: Number(mItem.memberProfileId) },
            });
          } else if (mItem.id) {
            mProfile = await tx.memberProfile.findUnique({
              where: { externalId: String(mItem.id) },
            });
          } else if (mItem.name) {
            mProfile = await tx.memberProfile.findFirst({
              where: { name: { contains: String(mItem.name), mode: "insensitive" } },
            });
          }

          if (mProfile) {
            const isL = mItem.role === "Başkan" || Boolean(mItem.isLeader);
            await tx.teamMembership.upsert({
              where: {
                memberId_teamId: {
                  memberId: mProfile.id,
                  teamId: updated.id,
                },
              },
              update: {
                roleTitle: mItem.role || "Uzman",
                isLeader: isL,
              },
              create: {
                memberId: mProfile.id,
                teamId: updated.id,
                roleTitle: mItem.role || "Uzman",
                isLeader: isL,
              },
            });
          }
        }
      }

      return tx.team.findUnique({
        where: { id: updated.id },
        include: {
          leader: true,
          memberships: {
            include: { member: true },
          },
        },
      });
    });

    res.json({ success: true, data: toTeamData(team) });
  } catch (error: any) {
    console.error("TEAMS PATCH ERROR:", error);
    res.status(500).json({ success: false, error: error?.message || "Ekip güncellenemedi." });
  }
});

// DELETE TEAM (Safe deletion: cleans up TeamMembership inside transaction, leaves MemberProfile & User intact)
router.delete("/:id", async (req, res) => {
  try {
    const externalId = req.params.id;

    const existingTeam = await prisma.team.findFirst({
      where: { OR: [{ externalId }, { slug: externalId }] },
    });

    if (!existingTeam) {
      return res.status(404).json({ success: false, error: "Silinecek ekip bulunamadı." });
    }

    await prisma.$transaction([
      prisma.teamMembership.deleteMany({
        where: { teamId: existingTeam.id },
      }),
      prisma.team.delete({
        where: { id: existingTeam.id },
      }),
    ]);

    res.json({ success: true, message: "Ekip ve üyelikleri başarıyla silindi." });
  } catch (error: any) {
    console.error("TEAMS DELETE ERROR:", error);
    res.status(500).json({ success: false, error: "Ekip silinemedi." });
  }
});

// REMOVE MEMBER FROM TEAM (Removes specific TeamMembership only, preserves MemberProfile & other TeamMemberships)
router.delete("/:id/members/:memberId", async (req, res) => {
  try {
    const teamIdOrSlug = req.params.id;
    const memberIdOrExternalId = req.params.memberId;

    const team = await prisma.team.findFirst({
      where: { OR: [{ externalId: teamIdOrSlug }, { slug: teamIdOrSlug }] },
    });

    if (!team) {
      return res.status(404).json({ success: false, error: "Ekip bulunamadı." });
    }

    const member = await prisma.memberProfile.findFirst({
      where: {
        OR: [
          { externalId: memberIdOrExternalId },
          { id: Number(memberIdOrExternalId) || -1 },
        ],
      },
    });

    if (!member) {
      return res.status(404).json({ success: false, error: "Üye bulunamadı." });
    }

    await prisma.$transaction(async (tx) => {
      await tx.teamMembership.deleteMany({
        where: {
          teamId: team.id,
          memberId: member.id,
        },
      });

      // If this member was team.leaderId, unset leaderId
      if (team.leaderId === member.id) {
        await tx.team.update({
          where: { id: team.id },
          data: { leaderId: null },
        });
      }
    });

    res.json({ success: true, message: "Üye ekipten çıkarıldı." });
  } catch (error: any) {
    console.error("REMOVE MEMBER FROM TEAM ERROR:", error);
    res.status(500).json({ success: false, error: "Üye ekipten çıkarılamadı." });
  }
});

export default router;
