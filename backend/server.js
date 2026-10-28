import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/index.js"; 

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Ne Yapsak Backend çalışıyor!"
  });
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kullanıcılar alınamadı." });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`);
});