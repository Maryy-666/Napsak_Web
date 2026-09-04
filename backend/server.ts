import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
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
import newsRouter from "./src/routes/news.js";
import homepageRouter from "./src/routes/homepage.js";
import positionsRouter from "./src/routes/positions.js";
import positionApplicationsRouter from "./src/routes/positionApplications.js";
import partnersRouter from "./src/routes/partners.js";
import { globalLimiter, authLimiter, formLimiter } from "./src/middleware/rateLimiter.js";



const app = express();

// Configure Trust Proxy for reverse proxy / Vercel / Cloudflare IP resolution
app.set("trust proxy", Number(process.env.TRUST_PROXY) || 1);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Helmet Security Headers (safe defaults, allowing cross-origin image embedding)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// Restricted CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("CORS ihlali: Erişim reddedildi."));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Global Rate Limiter (Production-safe, 300 requests per 15 min per IP)
app.use(globalLimiter);

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
app.use("/news", newsRouter);
app.use("/homepage", homepageRouter);
app.use("/positions", positionsRouter);
app.use("/position-applications", positionApplicationsRouter);
app.use("/partners", partnersRouter);



// Global Secure Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("UNHANDLED SERVER ERROR:", err);
  const isProd = process.env.NODE_ENV === "production";
  const statusCode = typeof err.status === "number" ? err.status : 500;
  res.status(statusCode).json({
    success: false,
    error: isProd ? "Sunucu tarafında bir hata oluştu." : (err.message || "Sunucu tarafında bir hata oluştu."),
    ...(isProd ? {} : { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT} adresinde çalışıyor.`);
});
