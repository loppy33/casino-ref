import type { Metadata } from "next";
import Script from 'next/script'
import "./styles/index.sass";
import AnalyticsClient from "./analytics-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Name";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-CJLBD61KDL";

export const metadata: Metadata = {
    // --- Ваши существующие метаданные ---
    title: `${siteName} — Bonus, Avis & Jeux Sécurisés`,
    description:
        "Découvrez les meilleurs casinos en ligne en France 🇫🇷 : bonus exclusifs, retraits rapides, et liens d’affiliation sécurisés. Jouez sur des sites fiables et agréés.",
    keywords: [
        "casino en ligne",
        "casinos France",
        "bonus casino",
        "jeux d’argent",
        "casino fiable",
        "machine à sous",
        "blackjack en ligne",
    ],
    authors: [{ name: "Walixway" }],
    creator: "Walixway",
    publisher: "Walixway",
    openGraph: {
        title: "Top Casinos en ligne France — Bonus & Avis",
        description:
            "Sélection premium des meilleurs casinos français avec les bonus exclusifs.",
        url: `${siteUrl}`,
        siteName: siteName,
        locale: "fr_FR",
        type: "website",
        images: [
            {
                url: `${siteUrl}/preview.png`, // Убедитесь, что 'public/preview.png' существует
                width: 1024,
                height: 935,
                alt: `${siteName} — Top Casinos en Ligne`,
            },
        ],
    },
    alternates: {
        canonical: `${siteUrl}`,
    },
    robots: {
        index: true,
        follow: true,
    },

    // --- 👇 ИСПРАВЛЕННЫЕ СЕКЦИИ ---

    /**
     * Путь к файлу 'site.webmanifest', который находится в 'public/logo/'
     */
    manifest: "/logo/site.webmanifest",

    /**
     * Определение всех иконок из папки 'public/logo/'
     */
    icons: {
        icon: [
            // Стандартный .ico
            { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },

            // PNG иконки
            { url: "/logo/favicon-16x16.png", type: "image/png", sizes: "16x16" },
            { url: "/logo/favicon-32x32.png", type: "image/png", sizes: "32x32" },

            // Иконки для Android/Chrome (Next.js добавит их в <head>)
            { url: "/logo/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
            { url: "/logo/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
        ],
        apple: [
            // Иконка для Apple-устройств
            { url: "/logo/apple-touch-icon.png", type: "image/png" },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body suppressHydrationWarning>
                {children}

                {/* Google Analytics */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                    strategy="lazyOnload"
                />

                <Script id="gtag-init" strategy="lazyOnload">
                    {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            // отключаем авт. отправку page_view, чтобы не дублировать и управлять SPA-навигом вручную
            gtag('config', '${GA_ID}', { send_page_view: false });
          `}
                </Script>

                {/* Клиентский компонент отслеживания маршрутов (отправляет page_view при смене маршрута) */}
                <AnalyticsClient gaId={GA_ID} />
            </body>
        </html>
    );
}