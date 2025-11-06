// app/articles/[slug]/page.tsx
import Bg from "@/components/Bg";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mdToPlain } from "@/utils/mdToPlain";

type ParamsP = Promise<{ slug?: string | string[] } | undefined>;
const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v ?? "");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function stripMd(md: string) {
    return md
        .replace(/`{1,3}[^`]*`{1,3}/g, "")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/[#>*_~\-`]+/g, "")
        .replace(/\n+/g, " ")
        .trim();
}
function readingTime(text: string) {
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 180)); // ~180 wpm
}

export async function generateMetadata({ params }: { params: ParamsP }): Promise<Metadata> {
    const p = (await params) ?? {};
    const slug = first(p.slug);
    if (!slug) return {};
    const article = await prisma.article.findUnique({
        where: { slug, published: true },
        include: { categories: true },
    });
    if (!article) return {};

    const plain = stripMd(article.bodyMd);
    const desc = plain.slice(0, 160) + (plain.length > 160 ? "…" : "");
    const title = `${article.title} — Guide & Analyse`;

    return {
        title,
        description: desc,
        openGraph: {
            title,
            description: desc,
            type: "article",
            url: `${siteUrl}/articles/${article.slug}`,
        },
        alternates: { canonical: `${siteUrl}/articles/${article.slug}` },
    };
}

export default async function ArticlePage({ params }: { params: ParamsP }) {
    const p = (await params) ?? {};
    const slug = first(p.slug);
    if (!slug) notFound();

    const article = await prisma.article.findUnique({
        where: { slug, published: true },
        include: { categories: true },
    });
    if (!article) notFound();

    const plain = stripMd(article.bodyMd);
    const readMin = readingTime(plain);

    const related = await prisma.article.findMany({
        where: {
            id: { not: article.id },
            published: true,
            ...(article.categories.length
                ? { categories: { some: { id: { in: article.categories.map(c => c.id) } } } }
                : {}),
        },
        orderBy: { createdAt: "desc" },
        take: 6,
    });

    let html = "";
    try {
        const MarkdownIt = (await import("markdown-it")).default;
        const md = new MarkdownIt({ linkify: true, breaks: true, html: false });
        const raw = md.render(article.bodyMd);
        try {
            const DOMPurify = (await import("isomorphic-dompurify")).default;
            html = DOMPurify.sanitize(raw);
        } catch {
            html = raw;
        }
    } catch {
        html = article.bodyMd.replace(/\n/g, "<br/>");
    }

    return (
        <div className="Home">
            <Bg />

            <section className="home-hero container">
                <nav className="section-head" aria-label="Fil d’Ariane" style={{ marginBottom: 8 }}>
                    <a className="section-head__link" href="/articles">Articles</a>
                    <span style={{ opacity: .6, margin: "0 6px" }}>/</span>
                    <span>{article.title}</span>
                </nav>

                <h1 className="home-hero__title">{article.title}</h1>
                <p className="home-hero__subtitle">
                    {new Date(article.createdAt).toLocaleDateString("fr-FR")} · {readMin} min de lecture
                </p>
            </section>

            <section className="home-section container" style={{ display: "grid", gap: 16, gridTemplateColumns: "minmax(0, 1fr)" }}>
                {article.categories.length > 0 && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {article.categories.map(cat => (
                            <a key={cat.id} href={`/categories/${cat.slug}`} className="cat-card" style={{ padding: "8px 10px" }}>
                                <span className="cat-card__dot" />
                                <span className="cat-card__name">{cat.name}</span>
                            </a>
                        ))}
                    </div>
                )}

                <article
                    className="article-card"
                    style={{ padding: 20, borderRadius: 14, lineHeight: 1.65, fontSize: "1.02rem" }}
                >
                    <div
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </article>
            </section>

            <section className="home-section container">
                <div className="section-head">
                    <h2>Articles similaires</h2>
                    <a className="section-head__link" href="/articles">Voir tous →</a>
                </div>

                {related.length ? (
                    <div className="article-grid">
                        {related.map(a => (
                            <article key={a.id} className="article-card">
                                <h3 className="article-card__title">
                                    <a href={`/articles/${a.slug}`}>{a.title}</a>
                                </h3>
                                <p className="article-card__excerpt">
                                    {mdToPlain(a.bodyMd).slice(0, 120)}{stripMd(a.bodyMd).length > 160 ? "…" : ""}
                                </p>
                                <a className="article-card__more" href={`/articles/${a.slug}`}>Lire →</a>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="empty">Aucun article similaire pour l’instant.</p>
                )}
            </section>
        </div>
    );
}
