import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const sans = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const serif = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "사주 리포트 | 만세력 계산과 명리 해석",
  description: "정확한 만세력 계산 엔진과 명리 규칙 엔진, AI 해석을 분리한 한국어 사주 분석 리포트 서비스입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-[var(--line)]">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="font-[var(--font-serif)] text-lg tracking-[0.2em]">
              四柱 REPORT
            </Link>
            <nav className="flex gap-5 text-sm text-[var(--muted)]">
              <Link href="/" className="hover:text-[var(--ivory)]">
                분석
              </Link>
              <Link href="/privacy" className="hover:text-[var(--ivory)]">
                개인정보
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--line)] px-5 py-8 text-center text-xs text-[var(--muted)]">
          만세력 계산은 코드가 하고, AI는 해석만 합니다. 의료·투자·법률 판단을 대체하지 않습니다.
        </footer>
      </body>
    </html>
  );
}
