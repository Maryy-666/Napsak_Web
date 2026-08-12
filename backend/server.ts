import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";

const app = express();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "N'apsak Backend çalışıyor!",
  });
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Kullanıcılar alınamadı.",
    });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`);
});
