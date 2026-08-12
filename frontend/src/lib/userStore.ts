import bcrypt from "bcryptjs";

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const globalForUserStore = globalThis as unknown as {
  userStore?: Map<string, UserRecord>;
};

const userStore = globalForUserStore.userStore ?? new Map<string, UserRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForUserStore.userStore = userStore;
}

const ADMIN_EMAIL = "admin@napsak.com";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("admin123", 12);

if (userStore.size === 0) {
  userStore.set(ADMIN_EMAIL, {
    id: "usr_admin",
    email: ADMIN_EMAIL,
    passwordHash: ADMIN_PASSWORD_HASH,
    name: "N'apsak Admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export const UserRepositoryService = {
  findUserByEmail(email: string): UserRecord | null {
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return null;
    }

    return userStore.get(email.toLowerCase().trim()) ?? null;
  },

  hasUser(email: string): boolean {
    if (!email || typeof email !== "string") return false;
    return userStore.has(email.toLowerCase().trim());
  },

  async verifyPassword(email: string, plainPassword: string): Promise<boolean> {
    const user = this.findUserByEmail(email);
    if (!user) return false;

    return bcrypt.compare(plainPassword, user.passwordHash);
  },

  async updateUserPassword(email: string, newPasswordHash: string): Promise<boolean> {
    const emailKey = email.toLowerCase().trim();
    const user = userStore.get(emailKey);

    if (!user) return false;

    user.passwordHash = newPasswordHash;
    user.updatedAt = new Date();
    userStore.set(emailKey, user);
    return true;
  },
};
