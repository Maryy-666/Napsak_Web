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

// GET /magazines - List all magazines
router.get("/", async (req, res) => {
  try {
    const magazines = await prisma.magazine.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: magazines });
  } catch (error) {
    console.error("MAGAZINES GET ERROR:", error);
    res.status(500).json({ error: "Dergiler alınamadı." });
  }
});

// POST /magazines - Create new magazine
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Başlık zorunludur." });
    }
    const magazine = await prisma.magazine.create({
      data: { title },
    });
    res.status(201).json({ success: true, data: magazine });
  } catch (error) {
    console.error("MAGAZINE CREATE ERROR:", error);
    res.status(500).json({ error: "Dergi oluşturulamadı." });
  }
});

// DELETE /magazines/:id - Delete magazine
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Geçersiz ID." });
    }
    await prisma.magazine.delete({ where: { id } });
    res.json({ success: true, message: "Dergi silindi." });
  } catch (error) {
    console.error("MAGAZINE DELETE ERROR:", error);
    res.status(500).json({ error: "Dergi silinemedi." });
  }
});

export default router;
