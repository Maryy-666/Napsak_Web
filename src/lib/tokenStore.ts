import crypto from "crypto";

// TODO: Replace with Prisma repository - Data Model Interface
export interface TokenRecord {
  email: string;
  hashedToken: string;
  expiresAt: number;
  used: boolean;
  createdAt: number;
}

interface RateLimitRecord {
  timestamps: number[];
}

// Hot-reload friendly singleton store for development servers
const globalForTokenStore = globalThis as unknown as {
  tokenStore?: Map<string, TokenRecord>;
  rateLimitStore?: Map<string, RateLimitRecord>;
};

// TODO: Replace with Prisma repository - In-memory Map store fallback
const tokenStore = globalForTokenStore.tokenStore ?? new Map<string, TokenRecord>();
const rateLimitStore = globalForTokenStore.rateLimitStore ?? new Map<string, RateLimitRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForTokenStore.tokenStore = tokenStore;
  globalForTokenStore.rateLimitStore = rateLimitStore;
}

/**
 * Hashes a plain token using SHA-256 before storing or querying.
 */
export function hashToken(plainToken: string): string {
  return crypto.createHash("sha256").update(plainToken).digest("hex");
}

export const TokenStoreService = {
  /**
   * Generates a secure random 32-byte hex token, hashes it, and stores it in memory.
   * Valid for 15 minutes.
   */
  generateAndSaveToken(email: string, durationMs: number = 15 * 60 * 1000): string {
    // Generate secure 32-byte random hex string (64 chars)
    const plainToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(plainToken);
    const now = Date.now();
    const expiresAt = now + durationMs;

    const record: TokenRecord = {
      email,
      hashedToken,
      expiresAt,
      used: false,
      createdAt: now,
    };

    // TODO: Replace with Prisma repository - Store token record in Database (prisma.passwordResetToken.create)
    tokenStore.set(hashedToken, record);

    return plainToken;
  },

  /**
   * Validates a plain token.
   * Checks existence, expiration, and used state.
   */
  validateToken(plainToken: string): {
    valid: boolean;
    email?: string;
    reason?: "EXPIRED" | "USED" | "INVALID";
  } {
    if (!plainToken || typeof plainToken !== "string") {
      return { valid: false, reason: "INVALID" };
    }

    const hashed = hashToken(plainToken);

    // TODO: Replace with Prisma repository - Query token record from Database (prisma.passwordResetToken.findUnique)
    const record = tokenStore.get(hashed);

    if (!record) {
      return { valid: false, reason: "INVALID" };
    }

    if (record.used) {
      return { valid: false, reason: "USED" };
    }

    if (Date.now() > record.expiresAt) {
      return { valid: false, reason: "EXPIRED" };
    }

    return { valid: true, email: record.email };
  },

  /**
   * Marks a token as used so it cannot be used again.
   */
  markTokenAsUsed(plainToken: string): boolean {
    const hashed = hashToken(plainToken);

    // TODO: Replace with Prisma repository - Update token record in Database (prisma.passwordResetToken.update)
    const record = tokenStore.get(hashed);
    if (!record) return false;

    record.used = true;
    tokenStore.set(hashed, record);
    return true;
  },

  /**
   * Delete token completely if necessary.
   */
  invalidateToken(plainToken: string): void {
    const hashed = hashToken(plainToken);
    // TODO: Replace with Prisma repository - Delete token record from Database (prisma.passwordResetToken.delete)
    tokenStore.delete(hashed);
  },

  /**
   * Rate Limiter: Max 5 requests per 15 minutes per IP address
   */
  isRateLimited(ip: string): boolean {
    const limitDuration = 15 * 60 * 1000;
    const maxRequests = 5;
    const now = Date.now();

    const record = rateLimitStore.get(ip);
    if (!record) return false;

    const activeTimestamps = record.timestamps.filter((ts) => now - ts < limitDuration);
    rateLimitStore.set(ip, { timestamps: activeTimestamps });

    return activeTimestamps.length >= maxRequests;
  },

  /**
   * Increment request count for a given IP
   */
  incrementRequest(ip: string): void {
    const now = Date.now();
    const record = rateLimitStore.get(ip) || { timestamps: [] };
    record.timestamps.push(now);
    rateLimitStore.set(ip, record);
  },
};
