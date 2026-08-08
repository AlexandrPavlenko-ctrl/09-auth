import React from "react";
import { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ReactQueryProvider from "@/components/TanStackProvider/TanStackProvider"; // Імпортуємо створений провайдер
import "./global.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-roboto",
  display: "block", // Встановлюємо display: "block" для кращого рендерингу шрифту
});

export const metadata: Metadata = {
  title: "NoteHub — Керування нотатками",
  description:
    "Прогресивний застосунок для створення, зберігання та швидкого пошуку текстових нотаток.",

  // ВИПРАВЛЕНО: Генерируем фавиконку из эмодзи прямо в коде (не требует наличия физического файла)
  icons:
    "data:image/svg+xml,<svg xmlns=%22http://w3.org viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📝</text></svg>",

  openGraph: {
    title: "NoteHub — Керування нотатками",
    description:
      "Прогресивний застосунок для створення, зберігання та швидкого пошуку текстових нотаток.",
    url: "https://notehub.com",
    images: [
      {
        url: "https://goit.global",
        width: 1200,
        height: 630,
        alt: "NoteHub Application Preview",
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="uk" className={roboto.variable}>
      <body className={roboto.className}>
        {/* Глобальний провайдер React Query для всіх сторінок сайту */}
        <ReactQueryProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </ReactQueryProvider>

        <div id="modal-root" />
      </body>
    </html>
  );
}
