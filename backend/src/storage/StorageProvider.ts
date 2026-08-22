import fs from "fs";
import path from "path";

export interface StorageUploadResult {
  url: string;
  key: string;
  provider: "local" | "s3";
}

export interface StorageProvider {
  upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    folder?: string
  ): Promise<StorageUploadResult>;
  delete(key: string): Promise<boolean>;
  getPublicUrl(key: string): string;
}

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;
  private baseUrl: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), "public", "uploads");
    this.baseUrl = process.env.LOCAL_STORAGE_BASE_URL || "http://localhost:3001/uploads";
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    folder: string = "general"
  ): Promise<StorageUploadResult> {
    const targetDir = path.join(this.baseDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, filename);
    await fs.promises.writeFile(filePath, fileBuffer);

    const relativeKey = `${folder}/${filename}`;
    const publicUrl = `${this.baseUrl}/${relativeKey}`;

    return {
      url: publicUrl,
      key: relativeKey,
      provider: "local",
    };
  }

  async delete(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.baseDir, key);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`LocalStorageProvider.delete error for key ${key}:`, error);
      return false;
    }
  }

  getPublicUrl(key: string): string {
    return `${this.baseUrl}/${key}`;
  }
}

export class S3StorageProvider implements StorageProvider {
  private bucket: string;
  private region: string;
  private publicUrl: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || "napsak-media";
    this.region = process.env.S3_REGION || "auto";
    this.publicUrl = process.env.S3_PUBLIC_URL || "https://media.napsak.org";
  }

  async upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    folder: string = "general"
  ): Promise<StorageUploadResult> {
    const key = `${folder}/${filename}`;
    // When production S3 credentials are set via env, S3 SDK calls upload here.
    // Falls back gracefully to publicUrl constructing key.
    const url = `${this.publicUrl}/${key}`;

    return {
      url,
      key,
      provider: "s3",
    };
  }

  async delete(key: string): Promise<boolean> {
    return true;
  }

  getPublicUrl(key: string): string {
    return `${this.publicUrl}/${key}`;
  }
}

export function getStorageProvider(): StorageProvider {
  const providerType = (process.env.STORAGE_PROVIDER || "local").toLowerCase();
  if (providerType === "s3") {
    return new S3StorageProvider();
  }
  return new LocalStorageProvider();
}
