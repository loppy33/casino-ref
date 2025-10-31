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
    <div className="AdminPage container">
      <h1>Админ-панель</h1>

      {/* Карточки-метрики */}
      <div className="cards">
        <div className="content">
          <h3>Клики (24ч)</h3>
          <p>{s.clicks24h}</p>
        </div>
        <div className="content">
          <h3>Клики (30д)</h3>
          <p>{s.clicks30d}</p>
        </div>
        <div className="content">
          <h3>Казино</h3>
          <p>{s.casinos}</p>
        </div>
        <div className="content">
          <h3>Статьи</h3>
          <p>{s.articles}</p>
        </div>
      </div>

      {/* Быстрые ссылки */}
      <div>
        <h2>Разделы</h2>
        <div className="links">
          <a href="/admin/casinos">
            Управление казино
          </a>
          <a href="/admin/articles">
            Статьи и обзоры
          </a>
          <a href="/admin/clicks">
            Логи кликов
          </a>
        </div>
      </div>
    </div>
  );
}
