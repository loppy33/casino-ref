// app/admin/page.tsx
import { prisma } from "@/lib/db";

async function getStats() {
  const now = new Date();
  const d1 = new Date(now);
  d1.setDate(now.getDate() - 1);     // последние 24 часа
  const d30 = new Date(now);
  d30.setDate(now.getDate() - 30);   // последние 30 дней

  const [casinos, articles, clicks24h, clicks30d] = await Promise.all([
    prisma.casino.count(),
    prisma.article.count(),
    prisma.click.count({ where: { createdAt: { gte: d1 } } }),
    prisma.click.count({ where: { createdAt: { gte: d30 } } }),
  ]);

  return { casinos, articles, clicks24h, clicks30d };
}

export default async function AdminPage() {
  const s = await getStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Админ-панель</h1>

      {/* Карточки-метрики */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Клики (24ч)</div>
          <div className="text-2xl font-bold">{s.clicks24h}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Клики (30д)</div>
          <div className="text-2xl font-bold">{s.clicks30d}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Казино</div>
          <div className="text-2xl font-bold">{s.casinos}</div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Статьи</div>
          <div className="text-2xl font-bold">{s.articles}</div>
        </div>
      </div>

      {/* Быстрые ссылки */}
      <div className="rounded-xl border p-4">
        <h2 className="text-lg font-medium mb-3">Разделы</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/casinos" className="px-3 py-2 rounded-lg border hover:bg-gray-50">
            Управление казино
          </a>
          <a href="/admin/articles" className="px-3 py-2 rounded-lg border hover:bg-gray-50">
            Статьи и обзоры
          </a>
          <a href="/admin/clicks" className="px-3 py-2 rounded-lg border hover:bg-gray-50">
            Логи кликов
          </a>
        </div>
      </div>
    </div>
  );
}
