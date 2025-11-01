// app/admin/articles/[id]/page.tsx
import { prisma } from "@/lib/db";
import { updateArticle } from "../actions";
import { notFound } from "next/navigation";

type ParamsP = Promise<{ id?: string | string[] } | undefined>;

function first(v?: string | string[]) {
    return Array.isArray(v) ? v[0] : v ?? "";
}

export default async function EditArticle({
    params,
}: {
    params: ParamsP;
}) {
    // 👇 Разворачиваем Promise и нормализуем id
    const p = (await params) ?? {};
    const id = first(p.id);

    if (!id) notFound();

    const [a, categories] = await Promise.all([
        prisma.article.findUnique({
            where: { id },
            include: { categories: true },
        }),
        prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);

    if (!a) notFound();

    const selected = new Set(a.categories.map((c) => c.id));

    return (
        <div className="FormPage container">
            <form action={updateArticle} className="base__form">
                <h2>Редактировать статью</h2>

                <input type="hidden" name="id" defaultValue={a.id} />
                <input name="title" defaultValue={a.title} required />
                <input name="slug" defaultValue={a.slug} required />

                <label className="checkbox">
                    <input type="checkbox" name="published" defaultChecked={a.published} /> Опубликована
                </label>

                <fieldset>
                    <legend>Категории</legend>
                    <div className="checkbox-list">
                        {categories.map((c) => (
                            <label key={c.id} className="checkbox">
                                <input
                                    type="checkbox"
                                    name="categoryIds"
                                    value={c.id}
                                    defaultChecked={selected.has(c.id)}
                                />{" "}
                                {c.name}
                            </label>
                        ))}
                    </div>
                </fieldset>

                <textarea name="bodyMd" rows={14} defaultValue={a.bodyMd} required />
                <button className="primary__btn">Сохранить</button>
            </form>
        </div>
    );
}
