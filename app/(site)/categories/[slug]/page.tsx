import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

type ParamsP = Promise<{ slug?: string | string[] } | undefined>;
const first = (v?: string | string[]) => Array.isArray(v) ? v[0] : v ?? "";

export default async function CategoryPage({ params }: { params: ParamsP }) {
    const p = (await params) ?? {};
    const slug = first(p.slug);
    if (!slug) notFound();

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            parent: true,
            // добавь нужные связи: children, casinos и т.п.
        },
    });

    if (!category) notFound();

    return (
        <div className="container">
            <h1>{category.name}</h1>
            {category.parent && <p>Родитель: {category.parent.name}</p>}
            <p>Slug: {category.slug}</p>
            {/* рендер содержимого категории */}
        </div>
    );
}
