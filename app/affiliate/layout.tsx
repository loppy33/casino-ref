import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restricted Access", // Скрытый заголовок
  robots: {
    index: false,  // 🚫 ЗАПРЕТ ИНДЕКСАЦИИ
    follow: false, // Не переходить по ссылкам
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}