import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer", "@react-pdf/font", "@react-pdf/pdfkit"],
  /** PDF API 서버리스 번들에 한글 폰트 포함 (fs로 읽는 경로는 자동 추적되지 않을 수 있음) */
  outputFileTracingIncludes: {
    "/api/payments/**/*": ["./src/assets/fonts/**/*"],
  },
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
};

export default nextConfig;
