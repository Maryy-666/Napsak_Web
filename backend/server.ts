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
import activitiesRouter from "./src/routes/activities.js";
import eventApplicationsRouter from "./src/routes/eventApplications.js";
import membersRouter from "./src/routes/members.js";
import teamsRouter from "./src/routes/teams.js";

import path from "path";
import reportsRouter from "./src/routes/reports.js";
import magazinesRouter from "./src/routes/magazines.js";
import pagesRouter from "./src/routes/pages.js";
import navigationRouter from "./src/routes/navigation.js";
import mediaRouter from "./src/routes/media.js";

const app = express();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

app.use(cors());
app.use(express.json());

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

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
console.log("🔥 AUTH ROUTER BAĞLANIYOR");
app.use("/auth", authRouter);
app.post("/auth-test", (req, res) => {
  res.json({ message: "AUTH TEST ÇALIŞIYOR" });
});
app.use("/applications", applicationsRouter);
app.use("/messages", messagesRouter);
app.use("/events", eventsRouter);
app.use("/activities", activitiesRouter);
app.use("/event-applications", eventApplicationsRouter);
app.use("/members", membersRouter);
app.use("/teams", teamsRouter);
app.use("/reports", reportsRouter);
app.use("/magazines", magazinesRouter);
app.use("/pages", pagesRouter);
app.use("/navigation", navigationRouter);
app.use("/media", mediaRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`);
});
