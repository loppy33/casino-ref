// app/admin/casinos/[id]/page.tsx
import { prisma } from "@/lib/db";
import { deleteBonus, deleteLink, updateCasino } from "../actions";

export default async function EditCasino({ params }: { params: { casinoId: string } }) {
    const { casinoId } = await params;     // 👈 распаковали

    const [casino, categories] = await Promise.all([
        prisma.casino.findUnique({
            where: { id: casinoId },           // 👈 теперь не undefined
            include: { categories: true, links: true, bonuses: true },
        }),
        prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);

    if (!casino) return <div className="container">Not found</div>;

    const selected = new Set(
        casino.categories.map((c: (typeof casino.categories)[number]) => c.id)
    );

    return (
        <div className="FormPage container">
            <form action={updateCasino} className="base__form">
                <h2>Edit casino</h2>
                <input type="hidden" name="id" defaultValue={casino.id} />
                <input name="name" defaultValue={casino.name} required />
                <input name="slug" defaultValue={casino.slug} required />
                <input name="license" defaultValue={casino.license || ""} />
                <input name="logoUrl" defaultValue={casino.logoUrl || ""} />
                <input name="rating" type="number" min={0} max={100} defaultValue={casino.rating ?? ""} />
                <input name="minDeposit" type="number" min={0} defaultValue={casino.minDeposit ?? ""} />
                <label className="checkbox">
                    <input type="checkbox" name="is18plus" defaultChecked={casino.is18plus} /> 18+ only
                </label>
                <textarea name="shortDesc" defaultValue={casino.shortDesc || ""} />

                <div className="grid-2">
                    <div>
                        <label>Pros</label>
                        <textarea name="pros" rows={6} defaultValue={(casino.pros || []).join("\n")} />
                    </div>
                    <div>
                        <label>Cons</label>
                        <textarea name="cons" rows={6} defaultValue={(casino.cons || []).join("\n")} />
                    </div>
                </div>

                <fieldset>
                    <legend>Categories</legend>
                    <div className="checkbox-list">
                        {categories.map((cat: (typeof categories)[number]) => (
                            <label key={cat.id} className="checkbox">
                                <input
                                    type="checkbox"
                                    name="categoryIds"
                                    value={cat.id}
                                    defaultChecked={selected.has(cat.id)}
                                />
                                {cat.name}
                            </label>
                        ))}
                    </div>
                </fieldset>

                <button className="primary__btn">Save</button>
            </form>

            <section className="mt-4">
                <h3>Affiliate links <a className="link__btn" href={`/admin/casinos/${casino.id}/links/new`}>+ Add link</a></h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Network</th>
                            <th>URL</th>
                            <th>subTemplate</th>
                            <th>primary</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {casino.links.map((l: (typeof casino.links)[number]) => (
                            <tr key={l.id}>
                                <td>
                                    <a href={`/admin/casinos/${casinoId}/links/${l.id}`}>{l.network}</a>
                                </td>
                                <td className="truncate">{l.baseUrl}</td>
                                <td className="truncate">{l.subTemplate || "-"}</td>
                                <td>{l.isPrimary ? "✓" : ""}</td>
                                <td className="ta-right">
                                    <form
                                        action={async () => {
                                            "use server";
                                            await deleteLink(l.id, casino.id);
                                        }}
                                    >
                                        <button className="danger__btn">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <section className="mt-4">
                <h3>Bonuses <a className="link__btn" href={`/admin/casinos/${casino.id}/bonuses/new`}>+ Add bonus</a></h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>URL</th>
                            <th>Promo code</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {casino.bonuses.map((b: (typeof casino.bonuses)[number]) => (
                            <tr key={b.id}>
                                <td>
                                    <a href={`/admin/casinos/${casinoId}/bonuses/${b.id}`}>{b.name}</a>
                                </td>
                                <td className="truncate">{b.bonusUrl || "-"}</td>
                                <td>{b.promocode || "-"}</td>
                                <td className="ta-right">
                                    <form
                                        action={async () => {
                                            "use server";
                                            await deleteBonus(b.id, casino.id);
                                        }}
                                    >
                                        <button className="danger__btn">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
