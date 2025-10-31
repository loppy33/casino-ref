import { prisma } from "@/lib/db";

export default async function CasinosPage() {
    const casinos = await prisma.casino.findMany();
    return (
        <div className="CasinoPage container">
            <h1>Список добавленных казино</h1>
            <a href="/admin/casinos/new" className="link__btn">+ Add Casino</a>
            <ul className="cards">
                {casinos.map(c => (
                    <li key={c.id} className="content">
                        <strong>{c.name}</strong> — {c.license}
                    </li>
                ))}
            </ul>
        </div>
    );
}
