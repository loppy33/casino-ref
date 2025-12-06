'use client';

import { useEffect, useState } from 'react';

type UserData = {
    username: string;
    avatar: string;
    referralCode: string;
    stats: { total: number; confirmed: number; balance: number };
};

const FORUMS = [
    // 🇫🇷 ТОП ФРАНЦИЯ (ОБЩИЕ)
    { name: "JeuxVideo.com (18-25)", type: "🔥 Самый активный (Топ 1)" },
    { name: "JeuxVideo.com (25-35)", type: "Более взрослая аудитория" },
    { name: "JeuxVideo.com (Finance)", type: "Раздел 'Finance & Business'" },
    { name: "Hardware.fr", type: "Discussions / Vie pratique" },
    { name: "CommentÇaMarche (CCM)", type: "Раздел 'Argent / Banque'" },
    { name: "RealityGaming (RG)", type: "Форум про игры и заработок" },

    // 🎰 ГЭМБЛИНГ И ПОКЕР (ЦЕЛЕВЫЕ)
    { name: "Club Poker", type: "Крупнейший покер-форум FR" },
    { name: "Wam-Poker", type: "Комьюнити игроков" },
    { name: "Poker Académie", type: "Обсуждение стратегий" },
    { name: "Gamoover", type: "Аркады и Ретро-игры" },
    { name: "SosCasino", type: "Отзывы и жалобы (Осторожно)" },

    // 💰 КРИПТА И ЗАРАБОТОК
    { name: "CryptoFR", type: "Главный крипто-форум Франции" },
    { name: "Bitcointalk (Français)", type: "Ветка Altcoins / Gambling" },
    { name: "Devenir-Rentier.fr", type: "Пассивный доход / Инвестиции" },
    { name: "Andlil", type: "Трейдинг и Финансы" },
    { name: "Finary Community", type: "Инвестиции (нужен мягкий подход)" },

    // 📱 СОЦСЕТИ И МЕССЕНДЖЕРЫ
    { name: "Twitter / X (#Casino)", type: "Тэги: #gambling #argent #slots" },
    { name: "Twitter / X (#Giveaway)", type: "Тэги: #concours #crypto" },
    { name: "Telegram: Crypto FR", type: "Чаты по крипте (спам)" },
    { name: "Telegram: Pronos Foot", type: "Чаты со ставками на спорт" },
    { name: "Discord: Serveurs NFT", type: "NFT/Crypto комьюнити" },
    { name: "Discord: Casino Communauté", type: "Поиск серверов через Disboard" },

    // 🌍 REDDIT (ФРАНКОЯЗЫЧНЫЕ)
    { name: "r/france", type: "Общее (Строгая модерация)" },
    { name: "r/vosfinances", type: "Финансы (Только экспертный тон)" },
    { name: "r/JeuxVideo", type: "Гейминг обсуждения" },
    { name: "r/Quebec", type: "Канада (Франкоговорящие)" },
    { name: "r/CryptoFR", type: "Криптовалюты" },

    // 👥 FACEBOOK ГРУППЫ
    { name: "FB: Paris Sportifs FR", type: "Группы прогнозов на спорт" },
    { name: "FB: Gagner de l'argent", type: "Группы по заработку" },
    { name: "FB: Casino en Ligne", type: "Фан-группы слотов" },
    { name: "FB: Expatriés Français", type: "Французы за границей" },

    // ⭐ ОТЗОВИКИ И ВОПРОСЫ
    { name: "TrustPilot", type: "Написать отзыв о CasinoSearch" },
    { name: "Quora (Français)", type: "Ответы на вопросы про казино" },
    { name: "Google Maps", type: "Фейк точки (креатив)" },
    { name: "SiteJabber", type: "Отзывы о сервисах" },

    // 🛠 ПРОЧЕЕ
    { name: "Medium / Teletype", type: "Статьи / Блоги (SEO)" },
    { name: "Pinterest", type: "Инфографика / Скриншоты" },
    { name: "TikTok", type: "Нарезка стримов (нужен аккаунт)" }
];

export default function AffiliatePage() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dash' | 'gen' | 'academy' | 'wallet'>('dash');

    // Login
    const [loginName, setLoginName] = useState("");
    const [loginError, setLoginError] = useState("");

    // Gen
    const [genForum, setGenForum] = useState("JeuxVideo.com");
    const [genTone, setGenTone] = useState("Hype");
    const [genKeys, setGenKeys] = useState("retrait rapide, gros gain");
    const [genResult, setGenResult] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    // Utils
    const copy = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => alert("✅ Скопировано!"));
        } else {
            const t = document.createElement("textarea");
            t.value = text; t.style.position = "fixed"; t.style.left = "-9999px";
            document.body.appendChild(t); t.select(); document.execCommand("copy");
            document.body.removeChild(t);
            alert("✅ Скопировано!");
        }
    };

    useEffect(() => {
        fetch('/api/affiliate/me')
            .then(res => { if (res.ok) return res.json(); throw new Error(); })
            .then(d => { setUser(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginName.trim()) return;
        const res = await fetch('/api/affiliate/auth', { method: 'POST', body: JSON.stringify({ username: loginName }) });
        if (res.ok) window.location.reload();
        else setLoginError("Ошибка. Попробуйте другой ник.");
    };

    const handleGenerate = async () => {
        if (!user) return;
        setIsGenerating(true);
        const res = await fetch('/api/affiliate/generate', {
            method: 'POST',
            body: JSON.stringify({ forum: genForum, tone: genTone, keywords: genKeys, refCode: user.referralCode })
        });
        const d = await res.json();
        setGenResult(d.prompt);
        setIsGenerating(false);
    };

    const handleWithdraw = () => {
        if (user && user.stats.balance >= 100) window.open("https://t.me/manager_contact", "_blank");
    }

    if (loading) return <div className="AffiliateLayout"><div style={{ paddingTop: 150, textAlign: 'center' }}>Загрузка терминала...</div></div>;

    // --- LOGIN SCREEN ---
    if (!user) {
        return (
            <div className="AffiliateLayout">
                <div className="aff-container">
                    <div className="login-screen">
                        <h1 className="logo-glitch">CASINO<span>SEARCH</span> TEAM</h1>
                        <p style={{ color: '#888', marginBottom: 40 }}>Система управления трафиком v3.0</p>

                        <div className="login-card">
                            <form onSubmit={handleLogin}>
                                <label style={{ display: 'block', textAlign: 'left', marginBottom: 10, color: '#aaa' }}>Идентификатор (Никнейм)</label>
                                <input
                                    placeholder="Придумайте позывной..."
                                    value={loginName}
                                    onChange={e => setLoginName(e.target.value)}
                                />
                                {loginError && <div style={{ color: 'red', marginBottom: 15 }}>{loginError}</div>}
                                <button type="submit" className="btn-magic" style={{ margin: 0 }}>ВОЙТИ В СИСТЕМУ</button>
                            </form>
                            <p style={{ marginTop: 20, fontSize: '0.8rem', color: '#555' }}>Доступ открыт для новых партнеров.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // --- MAIN APP ---
    return (
        <div className="AffiliateLayout">
            <div className="aff-container">

                {/* HEADER */}
                <div className="aff-header">
                    <div className="user-badge">
                        <img src={`/avatars/${user.avatar}`} className="avatar" alt="" />
                        <div className="u-info">
                            <div className="name">@{user.username}</div>
                            <div className="role">Media Buyer</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>БАЛАНС</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff88' }}>${user.stats.balance}</div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="aff-tabs">
                    <button className={activeTab === 'dash' ? 'active' : ''} onClick={() => setActiveTab('dash')}>📊 Дашборд</button>
                    <button className={activeTab === 'gen' ? 'active' : ''} onClick={() => setActiveTab('gen')}>⚡ Генератор</button>
                    <button className={activeTab === 'academy' ? 'active' : ''} onClick={() => setActiveTab('academy')}>🎓 Академия</button>
                    <button className={activeTab === 'wallet' ? 'active' : ''} onClick={() => setActiveTab('wallet')}>💰 Кошелек</button>
                </nav>

                {/* TAB 1: DASHBOARD */}
                {activeTab === 'dash' && (
                    <div className="fade-in">
                        <div className="grid-2">
                            <div className="aff-card">
                                <h3>📈 Статистика</h3>
                                <div style={{ display: 'flex', gap: 20 }}>
                                    <div className="stat-box">
                                        <div className="label">Клики</div>
                                        <div className="value">{user.stats.total}</div>
                                    </div>
                                    <div className="stat-box success">
                                        <div className="label">Лиды (FR)</div>
                                        <div className="value">{user.stats.confirmed}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="aff-card highlight">
                                <h3>🔗 Ваша ссылка</h3>
                                <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: 15 }}>
                                    Это ваш главный инструмент. Распространяйте её везде.
                                </p>
                                <div className="link-copy-wrapper" onClick={() => copy(`https://casinosearch.fr/?ref=${user.referralCode}`)}>
                                    <code>casinosearch.fr/?ref={user.referralCode}</code>
                                    <div className="badge">COPY</div>
                                </div>
                            </div>
                        </div>

                        <div className="aff-card">
                            <h3>ℹ️ Статус системы</h3>
                            <div style={{ display: 'grid', gap: 10, fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                                    <span>Гео:</span>
                                    <span style={{ color: '#fff' }}>🇫🇷 Франция (France)</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                                    <span>Оплата:</span>
                                    <span style={{ color: '#00ff88' }}>$10 / лид</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                                    <span>Выплаты:</span>
                                    <span style={{ color: '#fff' }}>USDT (TRC20)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: GENERATOR */}
                {activeTab === 'gen' && (
                    <div className="aff-card gen-grid fade-in">
                        <div className="controls">
                            <h3 style={{ marginBottom: 20 }}>Настройки Промпта</h3>

                            <div className="input-group">
                                <label>Площадка</label>
                                <select value={genForum} onChange={e => setGenForum(e.target.value)}>
                                    {FORUMS.map(f => <option key={f.name} value={f.name}>{f.name} ({f.type})</option>)}
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Стиль (Тон)</label>
                                <select value={genTone} onChange={e => setGenTone(e.target.value)}>
                                    <option value="Hype">🔥 Hype (Эмоции, выигрыш)</option>
                                    <option value="Expert">🧐 Expert (Обзор, факты)</option>
                                    <option value="Casual">🗣 Casual (Простой игрок)</option>
                                    <option value="Critique">🤔 Critique (Скрытая реклама)</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label>Ключевые слова (SEO)</label>
                                <input value={genKeys} onChange={e => setGenKeys(e.target.value)} />
                            </div>

                            <button className="btn-magic" onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? 'ANALYSING...' : 'СОЗДАТЬ ТЗ ДЛЯ AI'}
                            </button>
                        </div>

                        <div className="output">
                            <div className="prompt-output">
                                <div style={{ color: '#7000ff', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' }}>Результат (Готовый промпт):</div>
                                <pre>{genResult || "1. Выберите настройки слева.\n2. Нажмите кнопку.\n3. Получите идеальную инструкцию для ChatGPT."}</pre>
                                {genResult && (
                                    <button className="copy-btn" onClick={() => copy(genResult)}>СКОПИРОВАТЬ И ОТКРЫТЬ CHATGPT</button>
                                )}

                                <div style={{ marginTop: 20, fontSize: '0.8rem', color: '#555' }}>
                                    * Скопируйте этот текст и отправьте в любую нейросеть (ChatGPT, Claude).
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: ACADEMY */}
                {activeTab === 'academy' && (
                    <div className="fade-in">
                        <div className="aff-card">
                            <h2 style={{ fontSize: '2rem', marginBottom: 10, color: '#fff' }}>Академия Партнеров</h2>
                            <p style={{ color: '#aaa', marginBottom: 30 }}>Инструкция, как делать $1000+ в месяц на бесплатном трафике.</p>

                            <div className="guide-block">
                                <h3>🚀 Миссия проекта</h3>
                                <p>
                                    Мы продвигаем сайт-витрину <strong>CasinoSearch.fr</strong> во Франции.
                                    Наша задача — не просто спамить ссылками, а создавать <strong>качественные обсуждения</strong>.
                                    Чем естественнее выглядит ваш пост, тем больше людей перейдет по ссылке, и тем больше вы заработаете.
                                </p>
                            </div>

                            <div className="grid-2">
                                <div className="guide-block" style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 15 }}>
                                    <h3 style={{ color: '#00ff88' }}>✅ Что делать</h3>
                                    <ul>
                                        <li>Генерировать тексты через наш AI-генератор (он знает французский сленг).</li>
                                        <li>Публиковать посты на форумах, в Twitter, Facebook группах.</li>
                                        <li>Отвечать на вопросы других пользователей (с ссылкой).</li>
                                        <li>Использовать разные подходы: "Помогите найти", "Смотрите сколько выиграл", "Обзор сайта".</li>
                                    </ul>
                                </div>
                                <div className="guide-block" style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 15 }}>
                                    <h3 style={{ color: '#ff4444' }}>❌ Запрещено</h3>
                                    <ul>
                                        <li>Писать на русском или английском (Только French 🇫🇷).</li>
                                        <li>Публиковать одну и ту же фразу 100 раз (бан моментально).</li>
                                        <li>Обещать "100% гарантию выигрыша" (это скам).</li>
                                        <li>Использовать агрессивные боты.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="guide-block">
                                <h3>🌍 Где искать трафик? (Список площадок)</h3>
                                <div className="forum-list">
                                    {FORUMS.map(f => (
                                        <div key={f.name} className="forum-tag">
                                            <strong>{f.name}</strong>
                                            <span>{f.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="guide-block">
                                <h3>🤖 Как работать с Генератором?</h3>
                                <p>
                                    Вкладка "Генератор" создает <strong>Промпт</strong> (Инструкцию). Вы не получаете готовый французский текст сразу.
                                    Вы получаете ТЗ, которое нужно скопировать и вставить в ChatGPT.
                                    <strong>Почему так?</strong> Потому что ChatGPT каждый раз генерирует уникальный текст, который невозможно задетектить как спам.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: WALLET */}
                {activeTab === 'wallet' && (
                    <div className="aff-card wallet-hero fade-in">
                        <div className="balance-title">Текущий баланс</div>
                        <div className="balance-amount">${user.stats.balance}</div>

                        <div style={{ maxWidth: 400, margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#aaa', marginBottom: 5 }}>
                                <span>Прогресс до вывода</span>
                                <span>{Math.min(user.stats.balance, 100)}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="fill" style={{ width: `${Math.min(user.stats.balance, 100)}%` }}></div>
                            </div>
                        </div>

                        <button
                            className={`withdraw-btn ${user.stats.balance >= 100 ? 'ready' : ''}`}
                            onClick={handleWithdraw}
                            disabled={user.stats.balance < 100}
                        >
                            {user.stats.balance >= 100 ? 'ЗАПРОСИТЬ ВЫПЛАТУ' : `ЕЩЕ $${100 - user.stats.balance} ДО ВЫВОДА`}
                        </button>

                        <div style={{ marginTop: 40, textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 15 }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: 10, color: '#fff' }}>Финансовая информация</h3>
                            <ul style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.6, paddingLeft: 20 }}>
                                <li>Минимальная сумма вывода: <strong>$100</strong>.</li>
                                <li>Мы платим <strong>$10</strong> за каждого целевого игрока из Франции (который нажал "Играть").</li>
                                <li>Выплаты проводятся каждые 5 дней (по запросу).</li>
                                <li>Метод выплат: USDT (TRC20), Bitcoin, Банковские карты (через обменник).</li>
                                <li>За посты с охватом 1000 просмотров предусмотрены бонусы ($50-$200). Присылайте скриншоты менеджеру.</li>
                            </ul>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}