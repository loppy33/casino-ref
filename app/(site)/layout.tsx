export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header className="site__header">
                <div className="ad">
                    <img src="/age.png" alt="" />
                    18 ans et plus. Jouez de manière responsable. Pour de l’aide, visitez{" "}
                    <a target="_blank" href="https://BeGambleAware.org" rel="noopener noreferrer">
                        BeGambleAware.org
                    </a>{" "}
                    ou appelez le <strong>0808 8020 133</strong>.
                </div>
            </header>

            <main>{children}</main>

            <footer className="site-footer">
                <div className="container footer__inner">
                    {/* Logo + description */}
                    <div className="footer__brand">
                        <a href="/" className="footer__logo">
                            <img src="/logo.png" alt="Cazinoclub France" />
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
                                <li><a href="/contact">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4>Légal</h4>
                            <ul>
                                <li><a href="/mentions-legales">Mentions légales</a></li>
                                <li><a href="/politique-confidentialite">Confidentialité</a></li>
                                <li><a href="/cookies">Cookies</a></li>
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
                            © {new Date().getFullYear()} Cazinoclub France — Tous droits réservés.
                            Ce site contient des liens d’affiliation et ne propose aucun jeu d’argent.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
