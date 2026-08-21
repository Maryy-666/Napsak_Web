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

// GET /reports - List all reports
router.get("/", async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: reports });
  } catch (error) {
    console.error("REPORTS GET ERROR:", error);
    res.status(500).json({ error: "Raporlar alınamadı." });
  }
});

// POST /reports - Create new report
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Başlık zorunludur." });
    }
    const report = await prisma.report.create({
      data: { title },
    });
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    console.error("REPORT CREATE ERROR:", error);
    res.status(500).json({ error: "Rapor oluşturulamadı." });
  }
});

// DELETE /reports/:id - Delete report
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Geçersiz ID." });
    }
    await prisma.report.delete({ where: { id } });
    res.json({ success: true, message: "Rapor silindi." });
  } catch (error) {
    console.error("REPORT DELETE ERROR:", error);
    res.status(500).json({ error: "Rapor silinemedi." });
  }
});

export default router;
