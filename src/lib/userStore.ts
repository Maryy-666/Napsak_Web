import bcrypt from "bcryptjs";

// TODO: Replace with Prisma repository - User Entity Interface
export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Hot-reload friendly singleton store for development servers
const globalForUserStore = globalThis as unknown as {
  userStore?: Map<string, UserRecord>;
};

// TODO: Replace with Prisma repository - In-Memory Repository
const userStore = globalForUserStore.userStore ?? new Map<string, UserRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForUserStore.userStore = userStore;
}

// Pre-seeded default password hash for mock users (Password123!)
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync("Password123!", 12);

// Pre-populate mock database with common test accounts
const initialMockUsers: Array<{ email: string; name: string }> = [
  { email: "user@gmail.com", name: "Gmail User" },
  { email: "user@outlook.com", name: "Outlook User" },
  { email: "user@icloud.com", name: "iCloud User" },
  { email: "user@yahoo.com", name: "Yahoo User" },
  { email: "yusuf@napsak.com", name: "Yusuf Napsak" },
  { email: "demo@example.com", name: "Demo User" },
];

// Seed initial users if store is empty
if (userStore.size === 0) {
  initialMockUsers.forEach((u) => {
    const emailKey = u.email.toLowerCase().trim();
    userStore.set(emailKey, {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email: emailKey,
      passwordHash: DEFAULT_PASSWORD_HASH,
      name: u.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
}

export const UserRepositoryService = {
  /**
   * TODO: Replace with Prisma repository (prisma.user.findUnique)
   * Finds a user by email address.
   * In development mode, dynamically provisions unknown valid email addresses with default hash
   * so developers can test any real email provider seamlessly.
   */
  findUserByEmail(email: string): UserRecord | null {
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return null;
    }

    const emailKey = email.toLowerCase().trim();
    let user = userStore.get(emailKey);

    // Development fallback: Auto-provision any valid email address if not already registered
    if (!user) {
      user = {
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email: emailKey,
        passwordHash: DEFAULT_PASSWORD_HASH,
        name: emailKey.split("@")[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // TODO: Replace with Prisma repository - DB persistence
      userStore.set(emailKey, user);
    }

    return user;
  },

  /**
   * TODO: Replace with Prisma repository (prisma.user.findUnique)
   * Checks if user exists without auto-provisioning.
   */
  hasUser(email: string): boolean {
    if (!email || typeof email !== "string") return false;
    return userStore.has(email.toLowerCase().trim());
  },

  /**
   * Verifies plain text password against stored bcrypt passwordHash.
   */
  async verifyPassword(email: string, plainPassword: string): Promise<boolean> {
    const user = this.findUserByEmail(email);
    if (!user) return false;

    // Verify password hash using bcrypt.compare
    return await bcrypt.compare(plainPassword, user.passwordHash);
  },

  /**
   * TODO: Replace with Prisma repository (prisma.user.update)
   * Updates user's password hash in memory.
   */
  async updateUserPassword(email: string, newPasswordHash: string): Promise<boolean> {
    const emailKey = email.toLowerCase().trim();
    const user = userStore.get(emailKey) || this.findUserByEmail(emailKey);

    if (!user) return false;

    user.passwordHash = newPasswordHash;
    user.updatedAt = new Date();
    userStore.set(emailKey, user);
    return true;
  },

  /**
   * TODO: Replace with Prisma repository (prisma.user.create)
   * Creates a new user record with a bcrypt hashed password.
   */
  async createUser(email: string, plainPassword: string, name?: string): Promise<UserRecord> {
    const emailKey = email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(plainPassword, 12);

    const newUser: UserRecord = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email: emailKey,
      passwordHash,
      name: name || emailKey.split("@")[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userStore.set(emailKey, newUser);
    return newUser;
  },
};
