import { Request, Response, NextFunction } from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Oturum gerekli.",
      });
    }

    const token = authHeader.substring(7);

    const session = await prisma.session.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      return res.status(401).json({
        error: "Geçersiz oturum.",
      });
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.delete({
        where: {
          id: session.id,
        },
      });

      return res.status(401).json({
        error: "Oturumun süresi dolmuş.",
      });
    }

    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    };

    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);

    return res.status(500).json({
      error: "Oturum doğrulanamadı.",
    });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Oturum gerekli.",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "Bu işlem için yönetici yetkisi gerekiyor.",
    });
  }

  next();
};