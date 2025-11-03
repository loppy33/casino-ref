// app/admin/categories/[id]/page.tsx
import { prisma } from "@/lib/db";
import { updateCategory } from "../actions";
import { notFound } from "next/navigation";

type ParamsP = Promise<{ id?: string | string[] } | undefined>;

function first(v?: string | string[]) {
    return Array.isArray(v) ? v[0] : v ?? "";
}
export default async function EditCategory({ params }: { params: { id: string } }) {
    const p = (await params) ?? {};
    const id = first(p.id);
    if (!id) notFound();
    const [cat, parents] = await Promise.all([
        prisma.category.findUnique({ where: { id: id } }),
        prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    if (!cat) return <div className="container">Не найдено</div>;

    return (
        <div className="FormPage container">
            <form action={updateCategory} className="base__form">
                <h2>Редактировать категорию</h2>
                <input type="hidden" name="id" defaultValue={cat.id} />
                <input name="name" defaultValue={cat.name} required />
                <input name="slug" defaultValue={cat.slug} required />
                <select className="input" name="parentId" defaultValue={cat.parentId || ""}>
                    <option value="">(без родителя)</option>
                    {parents
                        .filter((p: (typeof parents)[number]) => p.id !== cat.id)
                        .map((p: (typeof parents)[number]) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}              </select>
                <button className="primary__btn">Сохранить</button>
            </form>
        </div>
    );
}
