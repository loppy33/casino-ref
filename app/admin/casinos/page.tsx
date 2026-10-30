// app/admin/casinos/page.tsx
import { prisma } from "@/lib/db";
import { deleteCasino } from "./actions";

export default async function CasinosPage() {
    const casinos = await prisma.casino.findMany({
        orderBy: { createdAt: "desc" },
        include: { categories: true, links: true },
    });

    return (
        <div className="AdminPage container">
            <h1>Casinos <a href="/admin/casinos/new" className="link__btn">+ Add</a></h1>
            

            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>License</th>
                        <th>Rating</th>
                        <th>Categories</th>
                        <th>Links</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {casinos.map((c: (typeof casinos)[number]) => (
                        <tr key={c.id}>
                            <td>
                                <a href={`/admin/casinos/${c.id}`}>{c.name}</a>
                            </td>
                            <td>{c.license || "-"}</td>
                            <td>{c.rating ?? "-"}</td>
                            <td>{c.categories.map((k: (typeof c.categories)[number]) => k.name).join(", ")}</td>
                            <td>{c.links.length}</td>
                            <td className="ta-right">
                                <form
                                    action={async () => {
                                        "use server";
                                        await deleteCasino(c.id);
                                    }}
                                    style={{ display: "inline-block", marginLeft: 8 }}
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
