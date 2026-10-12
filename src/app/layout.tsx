import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_KR, Noto_Serif, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans({
  variable: "--font-sans-latin",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const sansKr = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const serif = Noto_Serif({
  variable: "--font-serif-latin",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
});

const serifKr = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "사주 리포트 | 만세력 계산과 명리 해석",
  description: "정확한 만세력 계산 엔진과 명리 규칙 엔진, AI 해석을 분리한 사주 분석 리포트 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${sans.variable} ${sansKr.variable} ${serif.variable} ${serifKr.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
