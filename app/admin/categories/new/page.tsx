// app/admin/categories/new/page.tsx
import { prisma } from "@/lib/db";
import { createCategory } from "../actions";

export default async function NewCategory() {
    const parents = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return (
        <div className="FormPage container">
            <form action={createCategory} className="base__form">
                <h2>Новая категория</h2>
                <input name="name" placeholder="Название" required />
                <input name="slug" placeholder="slug" required />
                <select className="input" name="parentId" defaultValue="">
                    <option value="">(без родителя)</option>
                    {parents.map((p: (typeof parents)[number]) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <button className="primary__btn">Сохранить</button>
            </form>
        </div>
    );
}
