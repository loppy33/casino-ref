import { prisma } from "@/lib/db";
import {
    AlertTriangle,
    Database,
    FileText,
    MousePointerClick,
    TrendingUp,
    Clock,
    Link as LinkIcon
} from "lucide-react";

/** Получение статистики */
async function getStats() {
    try {
        const now = new Date();
        const d1 = new Date(now); d1.setDate(now.getDate() - 1);
        const d30 = new Date(now); d30.setDate(now.getDate() - 30);

        const [
            casinosCount,
            articlesCount,
            clicks24h,
            clicks30d,
            topCasinos,
            recentClicks,
            draftArticles,
            casinosWithoutLinks
        ] = await Promise.all([
            prisma.casino.count(),
            prisma.article.count(),
            prisma.click.count({ where: { createdAt: { gte: d1 } } }),
            prisma.click.count({ where: { createdAt: { gte: d30 } } }),

            // Топ 5 казино
            prisma.casino.findMany({
                take: 5,
                orderBy: { clicks: { _count: 'desc' } },
                select: { name: true, _count: { select: { clicks: true } } }
            }),

            // Последние 10 кликов
            prisma.click.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { casino: { select: { name: true } } }
            }),

            // Черновики
            prisma.article.count({ where: { published: false } }),

            // Ошибки: казино без ссылок
            prisma.casino.count({ where: { links: { none: {} } } })
        ]);

        return {
            casinosCount, articlesCount, clicks24h, clicks30d,
            topCasinos, recentClicks, draftArticles, casinosWithoutLinks
        };
    } catch (err) {
        console.error(err);
        return null;
    }
}

export default async function AdminPage() {
    const s = await getStats();

    if (!s) return <div className="AdminPage">Ошибка загрузки</div>;

    return (
        <div className="AdminPage container">
            <h1>
                Главная панель
                <span>Обновлено: {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
            </h1>

            {/* --- БЛОК 1: Карточки --- */}
            <section className="cards">

                <div className="card">
                    <div className="card-header">
                        <span>Клики (24ч)</span>
                        <MousePointerClick size={18} />
                    </div>
                    <div className="stat-value">{s.clicks24h.toLocaleString()}</div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span>Клики (30д)</span>
                        <TrendingUp size={18} />
                    </div>
                    <div className="stat-value">{s.clicks30d.toLocaleString()}</div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span>Казино</span>
                        <Database size={18} />
                    </div>
                    <div className="stat-value">
                        {s.casinosCount}
                        {/* Алерт, если есть казино без ссылок */}
                        {s.casinosWithoutLinks > 0 && (
                            <span className="badge error" title="Казино без партнерских ссылок">
                                <AlertTriangle size={12} /> {s.casinosWithoutLinks}
                            </span>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <span>Статьи</span>
                        <FileText size={18} />
                    </div>
                    <div className="stat-value">
                        {s.articlesCount}
                        {s.draftArticles > 0 && (
                            <span className="badge info" title="Черновики">
                                {s.draftArticles} черн.
                            </span>
                        )}
                    </div>
                </div>

            </section>

            {/* --- БЛОК 2: Детальная статистика --- */}
            <div className="dashboard-grid">

                {/* Панель: Топ Казино */}
                <div className="panel">
                    <h3><TrendingUp size={18} /> Топ казино (30 дн.)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th className="text-right">Клики</th>
                            </tr>
                        </thead>
                        <tbody>
                            {s.topCasinos.map((c: any, i: any) => (
                                <tr key={i}>
                                    <td>{c.name}</td>
                                    <td className="text-right">{c._count.clicks}</td>
                                </tr>
                            ))}
                            {s.topCasinos.length === 0 && (
                                <tr><td colSpan={2}>Нет данных</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Панель: Лог последних кликов */}
                <div className="panel">
                    <h3><Clock size={18} /> Последние переходы</h3>
                    <div className="log-list">
                        {s.recentClicks.map((click: any) => (
                            <div key={click.id} className="log-item">
                                <div className="log-info">
                                    <strong>{click.casino.name}</strong>
                                    <div className="meta">
                                        <span>{new Date(click.createdAt).toLocaleString('ru-RU')}</span>
                                        {click.source && <span className="tag">{click.source}</span>}
                                        {click.gclid && <span className="tag tag-green">Ads</span>}
                                    </div>
                                </div>
                                <LinkIcon size={14} style={{ opacity: 0.3 }} />
                            </div>
                        ))}
                        {s.recentClicks.length === 0 && <p style={{ opacity: 0.5 }}>Кликов пока нет</p>}
                    </div>
                </div>

            </div>
        </div>
    );
}