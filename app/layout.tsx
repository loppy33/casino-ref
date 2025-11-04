import type { Metadata } from "next";
import "./styles/index.sass";

export const metadata: Metadata = {
    title: "Casinos en ligne France — Bonus, Avis & Jeux Sécurisés",
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
            "Sélection premium des meilleurs casinos français avec liens d’affiliation sûrs et bonus exclusifs.",
        url: "http://localhost:3000/",
        siteName: "Cazinoclub France",
        locale: "fr_FR",
        type: "website",
        images: [
            {
                url: "http://localhost:3000/logo.png",
                width: 1200,
                height: 630,
                alt: "Cazinoclub France — Top Casinos en Ligne",
            },
        ],
    },
    alternates: {
        canonical: "http://localhost:3000/",
    },
    // manifest: "/manifest.webmanifest",
    icons: {
        icon: [
            { url: "/logo.png", type: "image/png", sizes: "32x32" },
            { url: "/logo.png", type: "image/png", sizes: "192x192" },
        ],
        apple: [
            { url: "/logo.png", sizes: "180x180", type: "image/png" },
        ],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body suppressHydrationWarning>{children}</body>
        </html>
    );
}
