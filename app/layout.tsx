import type { Metadata, Viewport } from "next"; // Добавили Viewport
import Script from 'next/script'
import { Inter } from "next/font/google"; // 1. Импорт шрифта
import "./styles/index.sass";
import AnalyticsClient from "./analytics-client";

// 1. Настройка шрифта (замените Inter на свой, если нужно)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Casino Search";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-CJLBD61KDL";

// 2. Глобальная Schema.org (JSON-LD)
// Это говорит Google: "Этот сайт принадлежит организации Casino Search"
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": siteUrl,
    "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo/android-chrome-512x512.png`, // Укажите путь к лого
        "width": 512,
        "height": 512
    },
    "sameAs": [
        // Сюда добавьте ссылки на соцсети, если есть (Twitter, FB, Telegram)
        "https://twitter.com/casinosearch",
    ]
};

// 3. Viewport теперь выносится отдельно (в Next.js 14+)
export const viewport: Viewport = {
    themeColor: "#ffffff", // Цвет браузной строки на мобилках
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl), // Важно для разрешения относительных путей картинок
    title: {
        default: `${siteName} — Bonus, Avis & Jeux Sécurisés`,
        template: `%s | ${siteName}`, // Чтобы на других страницах было "Название статьи | Casino Search"
    },
    description: "Découvrez les meilleurs casinos en ligne en France 🇫🇷 : bonus exclusifs, retraits rapides, et liens d’affiliation sécurisés.",

    // Подтверждение для Google Search Console (вставьте свой код)
    verification: {
        google: "ваш-код-верификации-из-search-console",
    },

    keywords: [
        "casino en ligne", "casinos France", "bonus casino", "jeux d’argent",
        "casino fiable", "machine à sous", "blackjack en ligne",
    ],
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,

    openGraph: {
        title: "Top Casinos en ligne France — Bonus & Avis",
        description: "Sélection premium des meilleurs casinos français avec les bonus exclusifs.",
        url: siteUrl,
        siteName: siteName,
        locale: "fr_FR",
        type: "website",
        images: [
            {
                url: "/preview.png", // Next.js сам подставит metadataBase
                width: 1200, // Стандарт OG
                height: 630,
                alt: `${siteName} — Top Casinos en Ligne`,
            },
        ],
    },
    alternates: {
        canonical: "./", // Автоматически генерирует канонический URL для каждой страницы
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    manifest: "/logo/site.webmanifest",
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
            { url: "/logo/favicon-16x16.png", type: "image/png", sizes: "16x16" },
            { url: "/logo/favicon-32x32.png", type: "image/png", sizes: "32x32" },
            { url: "/logo/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
        ],
        apple: [
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
        <html lang="fr" className={inter.variable}>
            <body suppressHydrationWarning className="font-sans">

                {/* Вставка JSON-LD Схемы */}
                <Script
                    id="organization-schema"
                    type="application/ld+json"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />

                <main>{children}</main>

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
            gtag('config', '${GA_ID}', { send_page_view: false });
          `}
                </Script>

                <AnalyticsClient gaId={GA_ID} />
            </body>
        </html>
    );
}