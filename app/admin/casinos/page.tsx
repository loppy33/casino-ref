import { prisma } from "@/lib/db";

export default async function CasinosPage() {
  const casinos = await prisma.casino.findMany();
  return (
    <div>
      <a href="/admin/casinos/new" className="bg-blue-600 text-white px-3 py-1 rounded">+ Add Casino</a>
      <ul className="mt-4 space-y-2">
        {casinos.map(c => (
          <li key={c.id} className="border p-2 rounded">
            <strong>{c.name}</strong> — {c.license}
          </li>
        ))}
      </ul>
    </div>
  );
}
