import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function shouldDisableTlsVerification(url: string) {
  if (process.env.DATABASE_SSL_NO_VERIFY === "true") return true;
  if (process.env.DATABASE_SSL_NO_VERIFY === "1") return true;

  // Supabase session pooler often requires relaxed TLS verification in serverless runtimes.
  return url.includes(".pooler.supabase.com");
}

function withoutSslQueryParams(url: string) {
  try {
    const parsed = new URL(url);
    const keysToRemove = [
      "sslmode",
      "sslcert",
      "sslkey",
      "sslrootcert",
      "sslpassword",
      "sslaccept",
      "uselibpqcompat",
    ];
    for (const key of keysToRemove) {
      parsed.searchParams.delete(key);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const disableTlsVerification = shouldDisableTlsVerification(url);
  const connectionString = disableTlsVerification ? withoutSslQueryParams(url) : url;
  const adapter = new PrismaPg({
    connectionString,
    ...(disableTlsVerification ? { ssl: { rejectUnauthorized: false } } : {}),
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
