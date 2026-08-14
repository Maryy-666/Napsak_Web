import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

import usersRouter from "./src/routes/users.js";
import authRouter from "./src/routes/auth.js";
import applicationsRouter from "./src/routes/applications.js";
import messagesRouter from "./src/routes/messages.js";
import eventsRouter from "./src/routes/events.js";

const app = express();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

app.use(cors());
app.use(express.json());

// Ana sayfa
app.get("/", (req, res) => {
  res.json({
    message: "N'apsak Backend çalışıyor!",
  });
});

// Server test
app.get("/test", (req, res) => {
  res.json({
    message: "YENİ SERVER ÇALIŞIYOR",
  });
});

// Messages test
app.get("/messages-test", (req, res) => {
  res.json({
    message: "MESSAGES ROUTE ÇALIŞIYOR",
  });
});

// Events test
app.get("/events-test", (req, res) => {
  res.json({
    message: "EVENTS ROUTE ÇALIŞIYOR",
  });
});

// API Routes
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/applications", applicationsRouter);
app.use("/messages", messagesRouter);
app.use("/events", eventsRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`);
});