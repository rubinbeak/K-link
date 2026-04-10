import { randomBytes } from "crypto";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { Font } from "@react-pdf/renderer";

let registered = false;

/** 로컬 파일 → (실패 시) 원격에서 받아 tmp 저장 후 경로로 등록 */
const FONT_SOURCES: { url: string; ext: ".ttf" | ".woff2" }[] = [
  {
    url: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanskr/static/NotoSansKR-Regular.ttf",
    ext: ".ttf",
  },
  {
    url: "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/static/NotoSansKR-Regular.ttf",
    ext: ".ttf",
  },
];

function localFontPath(): string {
  return path.join(process.cwd(), "public", "fonts", "NotoSansKR-Regular.ttf");
}

export async function registerInvoiceKoreanFont(): Promise<void> {
  if (registered) return;

  const local = localFontPath();
  if (existsSync(local)) {
    Font.register({ family: "NotoSansKR", src: local });
    registered = true;
    return;
  }

  const tmpRoot = path.join(os.tmpdir(), "klink-pdf-fonts");
  await mkdir(tmpRoot, { recursive: true });

  let lastErr: unknown;
  for (const { url, ext } of FONT_SOURCES) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(30_000),
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; K-LINK-Invoice/1.0)",
          Accept: "*/*",
        },
      });
      if (!res.ok) {
        lastErr = new Error(`font fetch ${res.status} ${url}`);
        continue;
      }
      const buf = new Uint8Array(await res.arrayBuffer());
      if (buf.byteLength < 20_000) {
        lastErr = new Error(`font too small (${buf.byteLength}) ${url}`);
        continue;
      }
      const tmpFile = path.join(tmpRoot, `NotoSansKR-${randomBytes(6).toString("hex")}${ext}`);
      await writeFile(tmpFile, buf);
      Font.register({ family: "NotoSansKR", src: tmpFile });
      registered = true;
      return;
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error("INVOICE_FONT_UNAVAILABLE");
}
