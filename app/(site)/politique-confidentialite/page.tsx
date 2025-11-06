const siteMail = process.env.NEXT_PUBLIC_SITE_MAIL || "mail@exmp.com";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "SiteName";

export default function PolitiqueConfidentialite() {
    return (
        <main className="MenLeg">
            <div className="MenLeg__hero">
                <div className="MenLeg__hero-inner container">
                    <div className="MenLeg__title">
                        <h1>Politique de confidentialité</h1>
                        <p className="lead">Protection des données et respect de la vie privée</p>
                    </div>
                </div>
            </div>

            <div className="container MenLeg__content">
                <div className="grid">
                    <article className="card">
                        <h2>Collecte des informations</h2>
                        <p>
                            Ce site collecte uniquement des données techniques nécessaires à son bon fonctionnement et à
                            l'analyse statistique du trafic : adresse IP hachée, type d'appareil, navigateur, et paramètres
                            de suivi d'affiliation (ex: identifiants de campagne ou source de trafic).
                        </p>
                    </article>

                    <article className="card">
                        <h2>Utilisation des données</h2>
                        <p>
                            Les données sont utilisées pour :
                        </p>
                        <ul>
                            <li>Mesurer les performances des liens d’affiliation ;</li>
                            <li>Améliorer l’expérience utilisateur et la pertinence du contenu ;</li>
                            <li>Garantir la sécurité et prévenir les abus.</li>
                        </ul>
                    </article>

                    <article className="card card--highlight">
                        <h2>Cookies</h2>
                        <p>
                            Ce site n’utilise pas de cookies publicitaires. Des cookies techniques peuvent être utilisés pour
                            maintenir les sessions d’administration et mesurer le trafic de manière anonyme via des outils
                            internes ou équivalents à Google Analytics, sans traçage individuel.
                        </p>
                    </article>

                    <article className="card">
                        <h2>Partage des données</h2>
                        <p>
                            Aucune donnée personnelle n’est partagée, vendue ou transmise à des tiers, sauf aux réseaux
                            d’affiliation partenaires pour le suivi des conversions. Ces partenaires respectent également les
                            normes RGPD.
                        </p>
                    </article>

                    <article className="card card--accent">
                        <h2>Durée de conservation</h2>
                        <p>
                            Les journaux de clics anonymisés sont conservés pour une durée maximale de 12 mois à des fins
                            d’analyse statistique, puis supprimés automatiquement.
                        </p>
                    </article>
                </div>

                <section className="notice">
                    <h3>Droits des utilisateurs</h3>
                    <p>
                        Conformément au Règlement Général sur la Protection des Données (RGPD), vous pouvez demander
                        l’accès, la rectification ou la suppression de vos données à tout moment en écrivant à :
                        <a href={`mailto:${siteMail}`}> {siteMail}</a>.
                    </p>
                </section>

                <footer className="MenLeg__footer">
                    <p>
                        © {new Date().getFullYear()} {siteName} — Politique de confidentialité •
                        <a href="/mentions-legales"> Mentions légales</a>
                    </p>
                </footer>
            </div>
        </main>
    );
}