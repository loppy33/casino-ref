import type { Metadata } from "next";
import { SECTIONS } from "./sections";
import FaqClient from "./FaqClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "";

export async function generateMetadata(): Promise<Metadata> {
    const ogImage = `${siteUrl}/logo.webp`;
    const year = new Date().getFullYear();

    return {
        title: `FAQ Casino en Ligne ${year} — Questions & Réponses`,
        description:
            "FAQ sur les casinos en ligne en France : tout savoir sur la sécurité, les licences, les bonus, les retraits, le KYC et le jeu responsable.",
        openGraph: {
            title: `FAQ Casino — ${siteName}`,
            description:
                "Questions fréquentes sur la sécurité, les bonus, les retraits, le KYC et le jeu responsable",
            url: `${siteUrl}/faq`,
            siteName,
            type: "website",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${siteName} — FAQ`,
                },
            ],
        },
        alternates: { canonical: `${siteUrl}/faq` },
    };
}

export default function Page() {
    // Schema.org FAQPage
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: SECTIONS.flatMap((s) =>
            s.items.map((it) => ({
                "@type": "Question",
                name: it.q,
                acceptedAnswer: { "@type": "Answer", text: it.a },
            }))
        ),
    };

    return (
        <div className="FaqPro">
            {/* Серверный JSON-LD для SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Клиентский компонент */}
            <FaqClient />
        </div>
    );
}