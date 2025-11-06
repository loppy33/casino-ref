const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "SiteName";
const siteMail = process.env.NEXT_PUBLIC_SITE_MAIL || "mail@exmp.com";


export default function MenLeg() {
    return (
        <main className="MenLeg">
            <div className="MenLeg__hero">
                <div className="MenLeg__hero-inner container">
                    <div className="MenLeg__title">
                        <h1>Mentions légales</h1>
                        <p className="lead">Informations légales et contact — site édité par un particulier</p>
                    </div>
                    <div className="MenLeg__cta">
                        <a href={`mailto:${siteMail}`} className="btn">Contactez-nous</a>
                        <a href="https://www.mvps.net/" target="_blank" rel="noopener noreferrer" className="btn btn--ghost">Hébergeur</a>
                    </div>
                </div>
            </div>


            <div className="container MenLeg__content">
                <div className="grid">
                    <article className="card">
                        <h2>Éditeur du site</h2>
                        <p>
                            Ce site est édité par un particulier. Pour toute question concernant le contenu ou
                            l'utilisation des données, vous pouvez nous contacter à l'adresse :
                            <a href={`mailto:${siteMail}`}> {siteMail}</a>.
                        </p>
                    </article>


                    <article className="card">
                        <h2>Hébergement</h2>
                        <p>
                            Le site est hébergé par <strong>MVPS.NET</strong>.
                        </p>
                        <p className="muted">Visitez : <a href="https://www.mvps.net/" target="_blank" rel="noopener noreferrer">mvps.net</a></p>
                    </article>


                    <article className="card card--highlight">
                        <h2>Objet du site</h2>
                        <p>
                            Ce site propose des comparatifs et des liens d’affiliation vers des plateformes de jeux en ligne.
                            Il ne propose pas directement de jeux et ne détient aucune licence d’opérateur.
                        </p>
                        <p className="tag">Interdit aux mineurs (-18 ans)</p>
                    </article>


                    <article className="card">
                        <h2>Responsabilité</h2>
                        <p>
                            L'éditeur décline toute responsabilité concernant le contenu des sites tiers vers lesquels des
                            liens sont proposés. Les utilisateurs sont invités à consulter les conditions générales de
                            chaque plateforme avant toute inscription.
                        </p>
                    </article>


                    <article className="card card--accent">
                        <h2>Jeu responsable</h2>
                        <p>
                            Les jeux d'argent comportent des risques : endettement, dépendance, isolement. Pour obtenir de
                            l'aide, consultez <a href="https://www.joueurs-info-service.fr/" target="_blank" rel="noopener noreferrer">joueurs-info-service.fr</a>
                            ou appelez le 09 74 75 13 13 (appel non surtaxé).
                        </p>
                    </article>
                </div>


                <section className="notice">
                    <h3>Conservation des données</h3>
                    <p>
                        Les données collectées (logs de clics anonymisés, hachage IP, informations techniques) sont utilisées
                        uniquement pour le suivi d'affiliation et les statistiques. Aucune revente de données personnelles.
                    </p>
                </section>


                <footer className="MenLeg__footer">
                    <p>© {new Date().getFullYear()} {siteName} — Mentions légales • <a href="/politique-confidentialite">Politique de confidentialité</a></p>
                </footer>
            </div>
        </main>
    );
}
