"use client";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "NAME";

import { useEffect, useState } from "react";
import Link from "next/link"; // 👈 Импортируем Link
import Image from "next/image";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 👈 State для меню

    // Эффект для "scrolled" хедера
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // 👈 Эффект для блокировки скролла body, когда меню открыто
    useEffect(() => {
        document.body.classList.toggle('menu-is-open', isMenuOpen);

        // Очистка при размонтировании
        return () => {
            document.body.classList.remove('menu-is-open');
        };
    }, [isMenuOpen]);

    // 👈 Функция для переключения меню
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // 👈 Функция для закрытия меню (используется на ссылках)
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* Добавляем класс, когда меню открыто, для стилизации (например, z-index) */}
            <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${isMenuOpen ? "is-menu-open" : ""}`}>
                <div className="container site-header__inner">
                    <Link href="/" className="site-header__logo" onClick={closeMenu}> {/* 👈 Меняем <a> на Link и добавляем onClick */}
                        <img src="/logoHeader.webp" alt={siteName} /> {/* 👈 Добавлен alt */}
                        {siteName}
                    </Link>

                    {/* 
                      👇 Навигация
                      - Добавлен класс .is-open
                      - <a> заменены на <Link>
                      - Добавлен onClick={closeMenu} для закрытия меню при клике на ссылку
                    */}
                    <nav className={`site-header__nav ${isMenuOpen ? "is-open" : ""}`}>
                        <Link href="/casinos" onClick={closeMenu}>Casinos</Link>
                        <Link href="/categories" onClick={closeMenu}>Catégories</Link>
                        <Link href="/articles" onClick={closeMenu}>Articles</Link>
                        <Link href="/faq" onClick={closeMenu}>Faq</Link>
                    </nav>

                    {/* 
                      👇 Кнопка Бургер
                      - Появляется только на мобильных
                      - Управляет состоянием isMenuOpen
                      - aria-label и aria-expanded для доступности (Accessibility)
                    */}
                    <button
                        className={`site-header__burger ${isMenuOpen ? "is-open" : ""}`}
                        onClick={toggleMenu}
                        aria-label="Toggle navigation"
                        aria-expanded={isMenuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className="site-header__age">
                    <span>
                        18 ans et plus. Jouez de manière responsable. Aide:{" "}
                        <a
                            target="_blank"
                            href="https://BeGambleAware.org"
                            rel="noopener noreferrer"
                        >
                            BeGambleAware.org
                        </a>
                    </span>
                </div>
            </header>

            <main>{children}</main>

            <footer className="site-footer">
                <div className="container footer__inner">
                    {/* Logo + description */}
                    <div className="footer__brand">
                        <a href="/" className="footer__logo">

                            <Image
                                src="/logo.webp"
                                alt="Casino Search"
                                width={100}
                                height={100}
                                quality={75}
                            />
                        </a>
                        <p className="footer__desc">
                            Le guide premium des meilleurs casinos en ligne en France. Profitez
                            de bonus exclusifs et jouez sur des plateformes sûres et agréées.
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="footer__nav">
                        <div>
                            <h4>Explorer</h4>
                            <ul>
                                <li><a href="/casinos">Casinos</a></li>
                                <li><a href="/categories">Catégories</a></li>
                                <li><a href="/articles">Articles</a></li>
                                <li><a href="/faq">Faq</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4>Légal</h4>
                            <ul>
                                <li><a href="/mentions-legales">Mentions légales</a></li>
                                <li><a href="/politique-confidentialite">Confidentialité</a></li>
                                <li><a href="/responsable-jeu">Jeu responsable</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4>Aide et Support</h4>
                            <ul className="support-list">
                                <li>
                                    <span>📞 Adictel:&nbsp;</span>
                                    <a href="tel:0974751313">09 74 75 13 13</a>
                                </li>
                                <li>
                                    <span>📞 SOS Joueurs:&nbsp;</span>
                                    <a href="tel:0969395512">09 69 39 55 12</a>
                                </li>
                                <li>
                                    <a
                                        href="https://BeGambleAware.org"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        🔗 BeGambleAware
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>

                {/* Bottom line */}
                <div className="footer__bottom">
                    <div className="container">
                        <p>
                            © {new Date().getFullYear()} {siteName} — Tous droits réservés.
                            Ce site contient des liens d’affiliation et ne propose aucun jeu d’argent.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
