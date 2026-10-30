// app/admin/articles/page.tsx
import { prisma } from "@/lib/db";
import { deleteArticle } from "./actions";

export default async function ArticlesPage() {
    const arts = await prisma.article.findMany({
        orderBy: { createdAt: "desc" },
        include: { categories: true },
    });
    return (
        <div className="AdminPage container">
            <h1>Articles <a href="/admin/articles/new" className="link__btn">+ Add</a></h1>
            <table className="table">
                <thead><tr><th>Title</th><th>slug</th><th>Categories</th><th>Published</th><th></th></tr></thead>
                <tbody>
                    {arts.map((a: (typeof arts)[number]) => (
                        <tr key={a.id}>
                            <td>
                                <a href={`/admin/articles/${a.id}`}>{a.title}</a>
                            </td>
                            <td>{a.slug}</td>
                            <td>
                                {a.categories.map((c: (typeof a.categories)[number]) => c.name).join(", ")}
                            </td>
                            <td>{a.published ? "✓" : ""}</td>
                            <td className="ta-right">
                                <form
                                    action={async () => {
                                        "use server";
                                        await deleteArticle(a.id);
                                    }}
                                >
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
