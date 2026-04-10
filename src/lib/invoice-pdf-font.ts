import { randomBytes } from "crypto";
import { existsSync, statSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { Font } from "@react-pdf/renderer";

let registered = false;

/** Vercel 등에서 fetch가 막혀도 동작하도록 fonts.gstatic 우선 */
const FONT_SOURCES: { url: string; ext: ".ttf" | ".woff2" }[] = [
  {
    url: "https://fonts.gstatic.com/s/notosanskr/v39/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLQ.ttf",
    ext: ".ttf",
  },
  {
    url: "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/notosanskr/static/NotoSansKR-Regular.ttf",
    ext: ".ttf",
  },
];

const MIN_FONT_BYTES = 100_000;

function resolveBundledFontPath(): string | null {
  const candidates = [
    path.join(process.cwd(), "src", "assets", "fonts", "NotoSansKR-Regular.ttf"),
    path.join(process.cwd(), "public", "fonts", "NotoSansKR-Regular.ttf"),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    try {
      if (statSync(p).size >= MIN_FONT_BYTES) return p;
    } catch {
      /* ignore */
    }
  }
  return null;
}

export async function registerInvoiceKoreanFont(): Promise<void> {
  if (registered) return;

  const bundled = resolveBundledFontPath();
  if (bundled) {
    Font.register({ family: "NotoSansKR", src: bundled });
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
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (compatible; K-LINK-Invoice/1.0)",
          Accept: "*/*",
        },
      });
      if (!res.ok) {
        lastErr = new Error(`font fetch ${res.status} ${url}`);
        continue;
      }
      const buf = new Uint8Array(await res.arrayBuffer());
      if (buf.byteLength < MIN_FONT_BYTES) {
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
