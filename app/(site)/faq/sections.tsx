import {
    Shield,
    Gift,
    CreditCard,
    IdCard,
    Scale,
    FileText,
    MessageCircle,
} from "lucide-react";

type QA = { q: string; a: string };
type Section = {
    id: string;
    title: string;
    icon: React.ReactNode;
    items: QA[];
};

export const SECTIONS: Section[] = [
    {
        id: "securite",
        title: "Légalité & sécurité",
        icon: <Shield className="w-5 h-5" />,
    items: [
            {
                q: "Les casinos présentés sont-ils légaux et sûrs en France ?",
                a: "Nous listons uniquement des opérateurs établis disposant d’une licence internationale valide (ex. Curaçao eGaming, Malta Gaming Authority) et acceptant les joueurs français, avec un site chiffré en TLS/SSL, des politiques KYC/AML détaillées et des fonds clients protégés (comptes séparés ou garanties équivalentes). Avant d’ajouter un opérateur, nous vérifions la présence des mentions légales, la transparence des conditions de bonus, le prestataire de jeux et de paiements et l’historique de plaintes publiques. Gardez toutefois à l’esprit que le contexte réglementaire évolue : jouez uniquement si vous comprenez les risques, et privilégiez les opérateurs avec réputation documentée et audités par des tiers."
            },
            {
                q: "Comment vérifier la licence d’un casino ?",
                a: "Descendez en pied de page (footer) et recherchez le sceau de l’autorité (Curaçao, MGA, etc.) avec un numéro/curseur cliquable ; ce lien doit renvoyer vers une page officielle de vérification listant le nom de la société, l’URL et le statut. Contrôlez aussi la concordance entre la société (raison sociale) et les Conditions Générales, et vérifiez la date d’émission/validité de la licence. En cas de doute (lien cassé, nom différent, absence d’adresse physique), évitez l’opérateur et contactez le support pour une confirmation écrite."
            },
            {
                q: "Puis-je jouer anonymement ?",
                a: "Non : tout opérateur sérieux appliquera un KYC progressif (identité, adresse, preuve du moyen de paiement) avant tout retrait, parfois dès l’inscription pour se conformer aux obligations AML et à la protection des mineurs. Certains casinos retardent la vérification jusqu’au premier retrait, mais ils restent en droit de la demander à tout moment. Fournir des informations exactes dès le départ vous évitera des blocages ultérieurs sur les paiements et réduira les délais de traitement."
            },
            {
                q: "Comment reconnaître un casino frauduleux ?",
                a: "Méfiez-vous des sites sans mentions légales ni politique de confidentialité claire, des conditions de bonus ambiguës, des bonus ‘illimités’ ou avec multiplicateurs irréalistes, et d’un support injoignable. L’absence de chiffrement (pas de HTTPS), des jeux dont les éditeurs ne sont pas reconnus, ou l’impossibilité de vérifier la licence sont des signaux d’alerte. Testez toujours avec un petit dépôt/retrait et consultez des sources tierces avant d’engager des montants importants."
            },
            {
                q: "Les casinos VPN sont-ils autorisés ?",
                a: "L’usage d’un VPN est souvent contraire aux Conditions d’Utilisation : il peut masquer la juridiction réelle et déclencher un blocage de compte, l’annulation de gains et la confiscation du solde. Même si le site est accessible sous VPN, cela n’implique pas que l’opérateur l’autorise. Si vous voyagez ou changez fréquemment d’IP, informez le support et demandez par écrit les règles applicables pour éviter tout litige."
            },
            {
                q: "Que faire si un casino refuse de payer mes gains ?",
                a: "Rassemblez systématiquement des preuves : captures d’écran, e-mails, extraits de conditions et historique des transactions. Ouvrez un ticket écrit auprès du service conformité et exigez une réponse argumentée pointant la clause exacte. Si le blocage persiste, saisissez le médiateur référencé par l’opérateur ou l’autorité de licence avec un dossier complet ; évitez les menaces publiques et privilégiez une démarche structurée et documentée."
            }
        ]
    },
    {
        id: "bonus",
        title: "Bonus & tours gratuits",
        icon: <Gift className="w-5 h-5" />,
    items: [
            {
                q: "Comment fonctionnent les bonus de bienvenue ?",
                a: "Ils ajoutent un pourcentage sur votre dépôt (ex. 100 % jusqu’à X €) et parfois des Free Spins. Lisez les Conditions : exigence de mise (wagering), jeux qui contribuent (les machines contribuent souvent 100 %, les tables moins), mise maximale sous bonus, plafond de gains et durée de validité. Par exemple, un wagering 30x sur un bonus de 100 € nécessite 3 000 € de mises éligibles ; si la durée est courte, mieux vaut choisir un bonus avec exigence plus faible."
            },
            {
                q: "Qu’est-ce qu’un bonus sans dépôt ?",
                a: "C’est un crédit gratuit ou des Free Spins sans dépôt initial, presque toujours assortis d’un plafond de retrait (ex. 50–100 €) et d’une mise max par tour. Ils sont utiles pour tester l’interface et le support, mais ne sont pas conçus pour des gains importants. Vérifiez si un dépôt de vérification est demandé avant tout retrait et si les jeux autorisés sont limités."
            },
            {
                q: "Comment choisir le meilleur bonus ?",
                a: "Comparez le pourcentage + le cap, le wagering (plus bas = mieux), la contribution par jeu et la mise max autorisée. Lisez aussi la politique de retraits partiels, la vitesse de traitement KYC et les limites hebdomadaires de cashout. Un bonus moyen sur un opérateur rapide et fiable vaut souvent mieux qu’un bonus énorme assorti de restrictions lourdes et de délais opaques."
            },
            {
                q: "Puis-je refuser un bonus ?",
                a: "Oui, c’est souvent possible lors du dépôt ou depuis le chat. Refuser un bonus supprime les contraintes de wagering et facilite les retraits rapides, utile pour les joueurs prudents. Si un bonus a été appliqué par défaut, demandez son annulation avant de jouer, faute de quoi vos gains seront probablement soumis aux conditions."
            },
            {
                q: "Les Free Spins ont-ils une valeur réelle ?",
                a: "Chaque Free Spin a une mise prédéfinie (ex. 0,10–1 €) : les gains sont crédités soit comme bonus soumis au wagering, soit directement en cash selon l’offre. Vérifiez sur quel(s) jeu(x) ils sont valables, la durée d’activation/expiration et le plafond de gain par lot de tours. Utilisez-les vite et suivez l’historique pour éviter la perte automatique à l’expiration."
            },
            {
                q: "Les programmes VIP valent-ils la peine ?",
                a: "Pour les joueurs réguliers, oui : cashback net, gestionnaire dédié, limites plus élevées et retraits prioritaires améliorent l’expérience. Évaluez toutefois la transparence des paliers, la conversion des points et les avantages réels (cadeaux, événements) versus le coût en volume de mise. Ne laissez jamais la poursuite d’un statut influencer votre budget responsable."
            }
        ]
    },
    {
        id: "retraits",
        title: "Dépôts & retraits",
        icon: <CreditCard className="w-5 h-5" />,
    items: [
            {
                q: "Combien de temps prennent les retraits ?",
                a: "Les e-wallets fiables traitent souvent en 0–24 h après validation, alors que cartes/SEPA prennent 1–3 jours ouvrés selon la banque. Le premier retrait peut être plus long à cause du KYC (vérification manuelle). Pour accélérer, validez votre identité dès l’inscription, utilisez le même moyen pour déposer/retirer et respectez les limites de mise sous bonus."
            },
            {
                q: "Pourquoi mon retrait est-il en attente ?",
                a: "Les causes fréquentes : KYC incomplet, dépassement de la mise max sous bonus, documents flous, ou horaires de traitement limités (conformité). Vérifiez la file des demandes dans votre compte et demandez un ETA au support. Tout changement d’IBAN, d’adresse ou d’IP atypique peut déclencher un contrôle supplémentaire."
            },
            {
                q: "Y a-t-il des frais ?",
                a: "Beaucoup d’opérateurs ne facturent pas de frais internes, mais certains prestataires (banques, e-wallets, crypto réseaux) prélèvent des coûts ou des taux de change. Consultez la page ‘Paiements’ et privilégiez des méthodes où vous maîtrisez les frais fixes/variables. Évitez les retraits multiples de petits montants si une grille de frais est appliquée."
            },
            {
                q: "Puis-je déposer avec une carte virtuelle ou Revolut ?",
                a: "Oui si le site accepte Visa/Mastercard et que votre émetteur autorise les transactions jeu. Toutefois, certains émetteurs bloquent par défaut : vous devrez peut-être autoriser la catégorie marchande dans l’app. Assurez-vous de pouvoir retirer par une méthode compatible (souvent SEPA ou e-wallet) si la carte virtuelle ne supporte pas les remboursements."
            },
            {
                q: "Les retraits crypto sont-ils plus rapides ?",
                a: "Souvent oui : une fois le contrôle KYC effectué, l’envoi on-chain (USDT, BTC, ETH) est rapide, mais dépend des frais et de la congestion réseau. Vérifiez la chaîne exacte (ex. ERC-20, TRC-20) pour éviter une perte irréversible. Conservez les TXIDs et alignez l’adresse de retrait avec votre portefeuille sécurisé."
            },
            {
                q: "Que faire si mon retrait est refusé ?",
                a: "Relisez la clause de wagering, la mise max sous bonus et les jeux exclus ; corrigez d’éventuels manquements (ex. rejouer un solde bonus). Assurez-vous que vos documents KYC sont valides et que le moyen de paiement appartient bien au titulaire du compte. En cas de désaccord, demandez la référence de la clause appliquée et escaladez auprès du médiateur."
            }
        ]
    },
    {
        id: "kyc",
        title: "Vérification KYC",
        icon: <IdCard className="w-5 h-5" />,
    items: [
            {
                q: "Quels documents sont nécessaires ?",
                a: "En général : pièce d’identité en cours de validité (CNI ou passeport), justificatif d’adresse ≤ 3 mois (facture, avis d’imposition, relevé bancaire) et preuve du moyen de paiement (capture IBAN ou carte masquée ne montrant que les 4 derniers chiffres). Les images doivent être nettes, en couleur, sans recadrage excessif. Les documents doivent correspondre exactement au nom et à l’adresse du compte joueur."
            },
            {
                q: "Combien de temps dure la vérification ?",
                a: "Comptez de quelques minutes à 48 h selon le volume et la qualité des pièces ; les week-ends/soirs peuvent rallonger le délai. Les opérateurs avec solution KYC automatisée sont plus rapides, mais un contrôle humain reste possible. Envoyer tous les documents d’un coup avec un intitulé clair accélère fortement la validation."
            },
            {
                q: "Que faire si mes documents sont refusés ?",
                a: "Vérifiez la raison exacte (flou, reflet, bord coupé, nom différent, document expiré). Refaites des photos droites, bien éclairées, sans filtre, et joignez l’original PDF pour les relevés. Si votre adresse a changé, fournissez un justificatif récent cohérent et mettez à jour votre profil avant de renvoyer."
            },
            {
                q: "Puis-je jouer sans avoir complété le KYC ?",
                a: "Vous pouvez généralement déposer et jouer, mais aucun retrait ne sera traité tant que la vérification n’est pas finalisée. Certains casinos limitent aussi les montants ou bloquent les bonus tant que l’identité n’est pas validée. Finalisez le KYC en amont pour éviter tout gel de fonds lors d’un gros gain."
            },
            {
                q: "Le KYC est-il obligatoire pour chaque retrait ?",
                a: "La première vérification est quasi systématique ; ensuite, des contrôles ponctuels peuvent intervenir (changement d’adresse, pic d’activité, nouveau moyen de paiement). Préparez une ‘trousse KYC’ (scan CNI/passeport, justificatif récent, preuve de paiement) afin de répondre vite aux demandes. Un historique propre réduit les frictions futures."
            }
        ]
    },
    {
        id: "limites",
        title: "Jeu responsable",
        icon: <Scale className="w-5 h-5" />,
    items: [
            {
                q: "Comment fixer des limites ?",
                a: "Depuis votre espace compte, définissez des plafonds de dépôt/jour/semaine/mois, des limites de mise et de durée de session, et activez des rappels de pause. Choisissez des montants compatibles avec votre budget loisir (argent ‘perdu d’avance’) et ajustez à la baisse si vous constatez une dérive. Les limites prennent effet parfois après un délai de réflexion : anticipez."
            },
            {
                q: "Où trouver de l’aide ?",
                a: "Des organismes spécialisés offrent un accompagnement gratuit et confidentiel : Adictel (09 74 75 13 13), SOS Joueurs (09 69 39 55 12) et des ressources en ligne comme BeGambleAware. Parlez-en à un proche de confiance, tenez un journal de jeu et utilisez les outils d’auto-évaluation. En cas d’urgence budgétaire, coupez immédiatement les méthodes de dépôt et demandez une auto-exclusion."
            },
            {
                q: "Comment reconnaître une dépendance au jeu ?",
                a: "Signes fréquents : jouer plus longtemps/plus cher que prévu, tenter de se ‘refaire’, mensonges à l’entourage, dettes, irritabilité hors jeu. Si vous vous reconnaissez, réduisez les stimuli (désinscription d’e-mails, blocage des sites), imposez des limites strictes et sollicitez une aide professionnelle. Un diagnostic précoce prévient l’escalade."
            },
            {
                q: "Les casinos peuvent-ils limiter mon compte ?",
                a: "Oui : à votre demande (limites volontaires) ou automatiquement si un risque est détecté (comportement à risque, transactions atypiques). Les bons opérateurs priorisent la sécurité sur le volume de jeu et peuvent abaisser vos plafonds ou recommander une pause. Considérez ces mesures comme une protection, pas une sanction."
            },
            {
                q: "Qu’est-ce que l’auto-exclusion ?",
                a: "C’est un blocage temporaire ou définitif de votre accès au compte, réglable de quelques jours à une durée indéfinie. Pendant ce temps, vous ne pouvez pas déposer ni jouer ; certains opérateurs bloquent aussi la création de nouveaux comptes liés. Choisissez une durée réaliste et combinez-la avec un suivi (associations, thérapie, gestion budgétaire)."
            }
        ]
    },
    {
        id: "fiscalite",
        title: "Fiscalité & conformité",
        icon: <FileText className="w-5 h-5" />,
    items: [
            {
                q: "Mes gains sont-ils imposables ?",
                a: "Cela dépend de votre situation et de l’évolution du cadre légal. Les gains occasionnels de joueurs non professionnels ne sont généralement pas imposés comme tels, mais des cas particuliers existent (fréquence élevée, organisation quasi-professionnelle). En cas de doute, conservez relevés et historiques et consultez un fiscaliste ; nous ne fournissons pas de conseil fiscal."
            },
            {
                q: "Dois-je déclarer mes gains au fisc français ?",
                a: "Si votre activité présente un caractère habituel et lucratif, l’administration peut la requalifier en revenus imposables, avec obligations déclaratives et sociales. À l’inverse, des gains sporadiques et modestes sont rarement requalifiés. Documentez vos dépôts/retraits et gardez les justificatifs bancaires pour étayer votre bonne foi en cas de contrôle."
            },
            {
                q: "Les casinos déclarent-ils mes gains ?",
                a: "Les opérateurs étrangers ne transmettent pas forcément d’informations à l’administration française, mais votre établissement bancaire peut signaler des flux atypiques. En pratique, la traçabilité repose sur vos mouvements financiers. D’où l’intérêt d’un suivi rigoureux (tableur ou relevé), surtout si vous multipliez les plateformes."
            },
            {
                q: "Les crypto-casinos sont-ils soumis aux mêmes règles ?",
                a: "Oui sur le principe : les plus-values réalisées lors de la conversion crypto→euros (ou crypto→crypto selon les cas) peuvent être imposables selon le régime en vigueur. La difficulté réside dans la tenue de registre (prix d’acquisition, date, frais, réseau). Utilisez un outil de suivi des transactions et demandez conseil avant toute régularisation."
            }
        ]
    },
    {
        id: "support",
        title: "Support & litiges",
        icon: <MessageCircle className="w-5 h-5" />,
    items: [
            {
                q: "Comment contacter le support d’un casino ?",
                a: "Privilégiez le chat 24/7 pour les demandes simples et l’e-mail pour les litiges (traçabilité). Préparez ID de compte, dates, montants, captures et lien vers la clause concernée. Demandez un numéro de ticket et centralisez tous vos échanges ; une communication claire et factuelle accélère la résolution."
            },
            {
                q: "Que faire en cas de litige ?",
                a: "Montez un dossier chronologique (inscription, dépôts, mises, bonus, retrait, réponses reçues) et réclamez une décision écrite citant les CGU. Si le désaccord persiste, contactez le médiateur indépendant listé par l’opérateur ou l’autorité de licence, en joignant vos preuves. Évitez les accusations publiques sans documents, elles affaiblissent votre crédibilité."
            },
            {
                q: "Comment savoir si un casino a un service client fiable ?",
                a: "Indicateurs positifs : réponses en < 2–3 minutes au chat, français correct, agents capables de citer précisément les clauses, suivi de dossier par e-mail avec références. Vérifiez aussi la disponibilité réelle (soir/week-end) et la cohérence des réponses entre agents. Faites un ‘test de stress’ avec une petite question avant d’engager des sommes."
            },
            {
                q: "Puis-je signaler un casino malhonnête ?",
                a: "Oui : écrivez à l’autorité de licence et, si nécessaire, à la DGCCRF pour pratiques commerciales trompeuses. Fournissez captures, historiques, CGU et tout échange pertinent. Plus votre dossier est factuel et organisé, plus vos chances d’obtenir une médiation rapide augmentent."
            },
            {
                q: "Les casinos ont-ils un médiateur officiel ?",
                a: "Les opérateurs sérieux référencent un organisme de médiation indépendant ; son rôle est d’examiner impartialement le litige et de proposer une issue fondée sur les CGU et la réglementation. Le recours au médiateur suppose d’avoir d’abord tenté une résolution interne. Respectez les délais et fournissez un dossier complet dès le premier envoi."
            }
        ]
    }
];
