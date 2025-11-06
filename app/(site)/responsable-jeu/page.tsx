const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "SiteName";

export default function ResponsableJeu() {
    return (
        <main className="MenLeg">
            <div className="MenLeg__hero">
                <div className="MenLeg__hero-inner container">
                    <div className="MenLeg__title">
                        <h1>Jeu responsable</h1>
                        <p className="lead">Jouer en ligne en toute sécurité et responsabilité</p>
                    </div>
                </div>
            </div>

            <div className="container MenLeg__content">
                <div className="grid">
                    <article className="card card--accent">
                        <h2>Risques liés aux jeux d'argent</h2>
                        <p>
                            Les jeux d'argent comportent des risques sérieux : endettement, dépendance, isolement et perte de contrôle.
                            Il est important de jouer uniquement avec des fonds que vous pouvez vous permettre de perdre.
                        </p>
                    </article>

                    <article className="card card--highlight">
                        <h2>Prévention et limites</h2>
                        <p>
                            Pour réduire les risques, vous pouvez :
                        </p>
                        <ul>
                            <li>Définir un budget de jeu et ne jamais le dépasser</li>
                            <li>Limiter la durée et la fréquence de vos sessions de jeu</li>
                            <li>Ne jamais utiliser le jeu pour compenser des pertes</li>
                            <li>Prendre régulièrement des pauses</li>
                        </ul>
                    </article>

                    <article className="card">
                        <h2>Aide et soutien</h2>
                        <p>
                            Si vous ressentez des difficultés liées au jeu, vous pouvez contacter des services d'aide :
                            <ul>
                                <li><a href="https://www.joueurs-info-service.fr/" target="_blank" rel="noopener noreferrer">joueurs-info-service.fr</a></li>
                                <li>Numéro d'assistance : 09 74 75 13 13 (appel non surtaxé)</li>
                            </ul>
                        </p>
                    </article>

                    <article className="card">
                        <h2>Accès réservé</h2>
                        <p>
                            L'accès aux jeux d'argent est strictement interdit aux mineurs de moins de 18 ans. Le site ne
                            propose pas de jeux directement, mais informe et redirige vers des plateformes partenaires.
                        </p>
                    </article>
                </div>

                <section className="notice">
                    <h3>Conseils pratiques</h3>
                    <p>
                        Rappelez-vous que le jeu doit rester un divertissement. Si vous sentez que le jeu devient un problème,
                        demandez de l'aide immédiatement. Jouez de manière responsable.
                    </p>
                </section>

                <footer className="MenLeg__footer">
                    <p>© {new Date().getFullYear()} {siteName} — Jeu responsable • <a href="/mentions-legales">Mentions légales</a></p>
                </footer>
            </div>
        </main>
    );
}