import type { Metadata } from "next";
import { DM_Sans, Noto_Sans_KR, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { TopNavigationBar } from "@/components/layout/top-navigation-bar";

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "K-LINK — 브랜드 & 크리에이터 캠페인 플랫폼",
    template: "%s · K-LINK",
  },
  description:
    "한국 뷰티 브랜드와 글로벌 인플루언서를 연결합니다. 브랜드 전용 한글 페이지와 크리에이터용 다국어 안내를 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${dmSans.variable} ${notoKr.variable} ${geistMono.variable} min-h-dvh overflow-x-hidden antialiased`}
      >
        <AuthSessionProvider>
          <TopNavigationBar />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
