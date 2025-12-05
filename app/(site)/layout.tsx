"use client";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "NAME";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // 1. Импортируем хук
import SpinBonus from "@/components/SpinBonus";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // 2. Получаем текущий путь
    const pathname = usePathname();

    // 3. Проверяем, находимся ли мы на странице детального казино
    // Логика: путь начинается с "/casinos/" И это не просто страница списка "/casinos"
    const isCasinoDetailPage = pathname?.startsWith("/casinos/") && pathname !== "/casinos";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.classList.toggle('menu-is-open', isMenuOpen);
        return () => {
            document.body.classList.remove('menu-is-open');
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${isMenuOpen ? "is-menu-open" : ""}`}>
                <div className="container site-header__inner">
                    <Link href="/" className="site-header__logo" onClick={closeMenu}>
                        <img src="/logoHeader.webp" alt={siteName} />
                        {siteName}
                    </Link>

                    <nav className={`site-header__nav ${isMenuOpen ? "is-open" : ""}`}>
                        <Link href="/casinos" onClick={closeMenu}>Casinos</Link>
                        <Link href="/categories" onClick={closeMenu}>Catégories</Link>
                        <Link href="/articles" onClick={closeMenu}>Articles</Link>
                        <Link href="/faq" onClick={closeMenu}>Faq</Link>
                    </nav>

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

            <main>
                {children}
                
                {/* 4. Рендерим SpinBonus ТОЛЬКО если это НЕ детальная страница казино */}
                {!isCasinoDetailPage && <SpinBonus />}
            </main>

            <footer className="site-footer">
                <div className="container footer__inner">
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