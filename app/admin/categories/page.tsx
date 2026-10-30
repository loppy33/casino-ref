// app/admin/categories/page.tsx
import { prisma } from "@/lib/db";
import { deleteCategory } from "./actions";

export default async function CategoriesPage() {
    const cats = await prisma.category.findMany({ include: { parent: true }, orderBy: { name: "asc" } });
    return (
        <div className="AdminPage container">
            <h1>Categories <a className="link__btn" href="/admin/categories/new">+ Add</a></h1>
            
            <table className="table">
                <thead><tr><th>Name</th><th>slug</th><th>Parent</th><th></th></tr></thead>
                <tbody>
                    {cats.map((c: (typeof cats)[number]) => (
                        <tr key={c.id}>
                            <td><a href={`/admin/categories/${c.id}`}>{c.name}</a></td>
                            <td>{c.slug}</td>
                            <td>{c.parent?.name || "-"}</td>
                            <td className="ta-right">
                                <form action={async () => { "use server"; await deleteCategory(c.id); }}>
                                    <button className="danger__btn">Delete</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
