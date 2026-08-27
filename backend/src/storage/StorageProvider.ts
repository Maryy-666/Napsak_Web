import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

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
  private client: S3Client;
  private bucket: string;
  private publicUrl?: string;

  constructor() {
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    const bucket = process.env.S3_BUCKET;
    const region = process.env.S3_REGION || "auto";
    const endpoint = process.env.S3_ENDPOINT;

    if (!accessKeyId || !secretAccessKey || !bucket) {
      throw new Error(
        "S3 Configuration Error: S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and S3_BUCKET environment variables are required when STORAGE_PROVIDER=s3."
      );
    }

    this.bucket = bucket;
    this.publicUrl = process.env.S3_PUBLIC_URL ? process.env.S3_PUBLIC_URL.replace(/\/+$/, "") : undefined;

    this.client = new S3Client({
      region,
      endpoint: endpoint || undefined,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: Boolean(endpoint && !endpoint.includes("amazonaws.com")),
    });
  }

  getPublicUrl(key: string): string {
    const cleanKey = key.replace(/^\/+/, "");
    if (this.publicUrl) {
      return `${this.publicUrl}/${cleanKey}`;
    }
    const endpoint = process.env.S3_ENDPOINT;
    if (endpoint) {
      const cleanEndpoint = endpoint.replace(/\/+$/, "");
      return `${cleanEndpoint}/${this.bucket}/${cleanKey}`;
    }
    return `https://${this.bucket}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${cleanKey}`;
  }

  async upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    folder: string = "general"
  ): Promise<StorageUploadResult> {
    const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
    const key = cleanFolder ? `${cleanFolder}/${filename}` : filename;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      ContentLength: fileBuffer.length,
    });

    await this.client.send(command);

    const url = this.getPublicUrl(key);

    return {
      url,
      key,
      provider: "s3",
    };
  }

  async delete(key: string): Promise<boolean> {
    try {
      const cleanKey = key.replace(/^\/+/, "");
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: cleanKey,
      });
      await this.client.send(command);
      return true;
    } catch (error) {
      console.error(`S3StorageProvider.delete error for key ${key}:`, error);
      return false;
    }
  }
}

export function getStorageProvider(): StorageProvider {
  const providerType = (process.env.STORAGE_PROVIDER || "local").toLowerCase();
  if (providerType === "s3") {
    return new S3StorageProvider();
  }
  return new LocalStorageProvider();
}
