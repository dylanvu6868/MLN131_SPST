import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Crimson_Text } from "next/font/google";

import { AtlasChatbotWidget } from "@/components/chatbot/atlas-chatbot-widget";
import { Navbar } from "@/components/layout/navbar";
import { LanguageProvider } from "@/lib/language-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});

const crimsonText = Crimson_Text({
  subsets: ["latin", "latin-ext"],
  variable: "--font-crimson",
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: "AtlasSocialism AI Agent — Bản đồ hệ tư tưởng và bộ máy nhà nước thế giới",
  description:
    "Khám phá hệ tư tưởng, chế độ chính trị, mô hình nhà nước, đảng cầm quyền và lãnh đạo của hơn 200 quốc gia qua bản đồ tương tác.",
  keywords: [
    "political atlas",
    "world politics",
    "ideology map",
    "political regimes",
    "socialism",
    "democracy",
    "government systems"
  ],
  openGraph: {
    title: "AtlasSocialism AI Agent",
    description:
      "Atlas chính trị có nguồn về hệ tư tưởng, chế độ, cấu trúc chính phủ, lãnh đạo và thiết chế nhà nước.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${crimsonText.variable}`}>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <a className="skip-link" href="#main-content">
            Bỏ qua điều hướng
          </a>
          <Navbar />
          <div id="main-content">{children}</div>
          <AtlasChatbotWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
