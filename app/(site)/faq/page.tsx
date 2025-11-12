"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Bg from "@/components/Bg";
import { SECTIONS } from "./sections";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Walixway";

export async function generateMetadata(): Promise<Metadata> {

    const ogImage = `${siteUrl}/logo.png`;

    return {
        title: `FAQ — ${siteName}`,
        description: "FAQ sur les casinos en ligne en France : tout savoir sur la sécurité, les licences, les bonus, les retraits, le KYC et le jeu responsable.",
        openGraph: {
            title: `FAQ — ${siteName}`,
            description: "Questions fréquentes sur la sécurité, les bonus, les retraits, le KYC et le jeu responsable",
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
export default function FaqPage() {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(SECTIONS[0].id);
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return SECTIONS;
        return SECTIONS.map((s) => ({
            ...s,
            items: s.items.filter(
                (it) => it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q)
            ),
        })).filter((s) => s.items.length > 0);
    }, [query]);

    useEffect(() => {
        const els = Array.from(
            containerRef.current?.querySelectorAll("[data-section]") ?? []
        ) as HTMLElement[];
        if (els.length === 0) return;
        const io = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible) setActive(visible.target.id);
            },
            { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [filtered]);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": SECTIONS.flatMap((s) =>
            s.items.map((it) => ({
                "@type": "Question",
                name: it.q,
                acceptedAnswer: { "@type": "Answer", text: it.a },
            }))
        ),
    };

    return (
        <div className="FaqPro">
            <Bg />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <section className="container faq-hero">
                <h1 className="faq-hero__title">
                    Foire aux <span>questions</span>
                </h1>
                <p className="faq-hero__subtitle">
                    Tout ce qu’il faut savoir pour jouer en sécurité : licences, bonus, retraits, KYC, limites, fiscalité et support. 18+.
                </p>

                <div className="faq-search">
                    <input
                        type="search"
                        placeholder="Rechercher une question…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Rechercher dans la FAQ"
                    />
                </div>
            </section>

            <section className="container faq-body">
                <aside className="faq-toc" aria-label="Navigation FAQ">
                    <nav>
                        {SECTIONS.map((s) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className={active === s.id ? "is-active" : ""}
                            >
                                <span className="i">{s.icon}</span>
                                {s.title}
                            </a>
                        ))}
                    </nav>
                    <div className="faq-help">
                        <div className="line">Besoin d’aide immédiate ?</div>
                        <ul>
                            <li>📞 Adictel : <a href="tel:0974751313">09 74 75 13 13</a></li>
                            <li>📞 SOS Joueurs : <a href="tel:0969395512">09 69 39 55 12</a></li>
                            <li>🔗 <a href="https://BeGambleAware.org" target="_blank" rel="noreferrer">BeGambleAware.org</a></li>
                        </ul>
                    </div>
                </aside>

                <div className="faq-list" ref={containerRef}>
                    {filtered.length === 0 && (
                        <p className="faq-empty">
                            Aucun résultat. Essayez un autre terme (ex. “bonus”, “retrait”, “KYC”).
                        </p>
                    )}

                    {filtered.map((s) => (
                        <section
                            key={s.id}
                            id={s.id}
                            data-section
                            className="faq-section"
                            aria-labelledby={`${s.id}-title`}
                        >
                            <h2 id={`${s.id}-title`} className="faq-section__title">
                                <span className="i">{s.icon}</span>
                                {s.title}
                            </h2>

                            {s.items.map((it, idx) => (
                                <details key={idx} className="faq-item">
                                    <summary className="faq-q">
                                        {it.q}
                                        <span className="arrow" aria-hidden>▾</span>
                                    </summary>
                                    <div className="faq-a">{it.a}</div>
                                </details>
                            ))}
                        </section>
                    ))}
                </div>
            </section>
        </div>
    );
}
