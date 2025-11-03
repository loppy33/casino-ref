import { prisma } from "@/lib/db";
import { AlertTriangle, Database, FileText, MousePointerClick } from "lucide-react";

/** Получение статистики по казино, статьям и кликам */
async function getStats() {
  try {
    const now = new Date();
    const d1 = new Date(now);
    d1.setDate(now.getDate() - 1); // последние 24 часа
    const d30 = new Date(now);
    d30.setDate(now.getDate() - 30); // последние 30 дней

    const [casinos, articles, clicks24h, clicks30d] = await Promise.all([
      prisma.casino.count(),
      prisma.article.count(),
      prisma.click.count({ where: { createdAt: { gte: d1 } } }),
      prisma.click.count({ where: { createdAt: { gte: d30 } } }),
    ]);

    return { casinos, articles, clicks24h, clicks30d };
  } catch (err) {
    console.error("Ошибка получения статистики:", err);
    return { casinos: 0, articles: 0, clicks24h: 0, clicks30d: 0 };
  }
}

export default async function AdminPage() {
  const s = await getStats();

  return (
    <div className="AdminPage container">
      <h1>Обзор</h1>
      <section className="cards">
        <div className="content">
          <div className="card-header">
            <MousePointerClick size={16} />
            <h3>Клики (24ч)</h3>
          </div>
          <p className="stat">{s.clicks24h.toLocaleString()}</p>
        </div>

        <div className="content">
          <div className="card-header">
            <MousePointerClick size={16} />
            <h3>Клики (30д)</h3>
          </div>
          <p className="stat">{s.clicks30d.toLocaleString()}</p>
        </div>

        <div className="content">
          <div className="card-header">
            <Database size={16} />
            <h3>Казино</h3>
          </div>
          <p className="stat">{s.casinos}</p>
        </div>

        <div className="content">
          <div className="card-header">
            <FileText size={16} />
            <h3>Статьи</h3>
          </div>
          <p className="stat">{s.articles}</p>
        </div>
      </section>
    </div>
  );
}
