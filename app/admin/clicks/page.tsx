// app/admin/clicks/page.tsx
import { prisma } from "@/lib/db";

type SearchParamsP = Promise<{ page?: string | string[] } | undefined>;

function first(v?: string | string[]) {
    return Array.isArray(v) ? v[0] : v ?? "";
}

function parsePage(v?: string | string[]) {
    const s = first(v).trim();
    const n = Number.parseInt(s, 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
}

export default async function ClicksPage({
    searchParams,
}: {
    searchParams: SearchParamsP;
}) {
    const sp = (await searchParams) ?? {};
    const page = parsePage(sp.page);
    const take = 50;
    const skip = (page - 1) * take;

    const [items, total] = await Promise.all([
        prisma.click.findMany({
            orderBy: { createdAt: "desc" },
            take,
            skip,
            include: { casino: true, link: true },
        }),
        prisma.click.count(),
    ]);

    const pages = Math.max(1, Math.ceil(total / take));

    return (
        <div className="AdminPage container">
            <h1>Клики</h1>
            <p>Всего: {total}</p>

            <table className="table">
                <thead>
                    <tr>
                        <th>Когда</th>
                        <th>Казино</th>
                        <th>Сеть</th>
                        <th>Источник</th>
                        <th>gclid</th>
                        <th>UA</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((i) => (
                        <tr key={i.id}>
                            <td>
                                {new Date(i.createdAt).toLocaleString("ru-RU", {
                                    hour12: false,
                                })}
                            </td>
                            <td>{i.casino?.name ?? "-"}</td>
                            <td>{i.link?.network ?? "-"}</td>
                            <td>{i.source ?? "-"}</td>
                            <td className="truncate">{i.gclid ?? "-"}</td>
                            <td className="truncate">
                                {typeof i.userAgent === "string"
                                    ? i.userAgent.slice(0, 80)
                                    : "-"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pager">
                {Array.from({ length: pages }).map((_, idx) => {
                    const p = idx + 1;
                    return (
                        <a
                            key={p}
                            className={p === page ? "active" : ""}
                            href={`/admin/clicks?page=${p}`}
                        >
                            {p}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
