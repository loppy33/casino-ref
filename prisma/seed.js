// Demo data for local development and the portfolio screenshots.
// All casinos, bonuses and affiliate URLs are fictional (example.com).
// Run with: npx prisma db seed
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const prisma = new PrismaClient();

const categories = [
  { slug: "meilleurs-casinos", name: "Meilleurs casinos en ligne" },
  { slug: "bonus-sans-depot", name: "Bonus sans dépôt", parent: "meilleurs-casinos" },
  { slug: "casinos-live", name: "Casinos live", parent: "meilleurs-casinos" },
  { slug: "paiement-rapide", name: "Paiement rapide", parent: "meilleurs-casinos" },
  { slug: "casinos-crypto", name: "Casinos crypto" },
  { slug: "machines-a-sous", name: "Machines à sous" },
  { slug: "guides", name: "Guides & conseils" },
];

const casinos = [
  {
    slug: "royal-spin", name: "Royal Spin", rating: 96, license: "Malta Gaming Authority", minDeposit: 10,
    shortDesc: "Un casino premium avec plus de 3 000 jeux, un programme VIP généreux et des retraits en moins de 24 h.",
    pros: ["Plus de 3 000 jeux", "Retraits en 24 h", "Programme VIP"], cons: ["Mise minimale de 35x sur le bonus"],
    categories: ["meilleurs-casinos", "casinos-live", "paiement-rapide"],
    bonuses: [{ name: "100% jusqu'à 500 € + 200 tours gratuits", promocode: "ROYAL200" }, { name: "Cashback hebdomadaire 10%", promocode: null }],
  },
  {
    slug: "lucky-fox", name: "Lucky Fox", rating: 92, license: "Curaçao eGaming", minDeposit: 20,
    shortDesc: "Casino ludique axé sur les machines à sous, avec des tournois quotidiens et des tours gratuits chaque semaine.",
    pros: ["Tournois quotidiens", "Tours gratuits hebdomadaires"], cons: ["Support live uniquement en anglais"],
    categories: ["meilleurs-casinos", "machines-a-sous", "bonus-sans-depot"],
    bonuses: [{ name: "50 tours gratuits sans dépôt", promocode: "FOX50" }],
  },
  {
    slug: "golden-ace", name: "Golden Ace", rating: 89, license: "UK Gambling Commission", minDeposit: 15,
    shortDesc: "Spécialiste du blackjack et du poker en ligne avec des croupiers en direct 24h/24.",
    pros: ["Tables live 24h/24", "Limites élevées"], cons: ["Peu de machines à sous"],
    categories: ["meilleurs-casinos", "casinos-live"],
    bonuses: [{ name: "Bonus de bienvenue 150% jusqu'à 300 €", promocode: "ACE150" }],
  },
  {
    slug: "neon-vegas", name: "Neon Vegas", rating: 87, license: "Malta Gaming Authority", minDeposit: 10,
    shortDesc: "Ambiance néon, interface ultra rapide et excellent catalogue de jackpots progressifs.",
    pros: ["Jackpots progressifs", "Interface mobile soignée"], cons: ["Pas de bonus sans dépôt"],
    categories: ["meilleurs-casinos", "machines-a-sous", "paiement-rapide"],
    bonuses: [{ name: "Pack de bienvenue 3 dépôts jusqu'à 1 000 €", promocode: "NEON1000" }],
  },
  {
    slug: "jade-palace", name: "Jade Palace", rating: 84, license: "Kahnawake Gaming Commission", minDeposit: 25,
    shortDesc: "Casino à thème asiatique avec baccarat, sic bo et un service client très réactif.",
    pros: ["Baccarat et sic bo", "Support réactif"], cons: ["Dépôt minimum plus élevé"],
    categories: ["casinos-live"],
    bonuses: [{ name: "Bonus VIP 200% jusqu'à 400 €", promocode: "JADE200" }],
  },
  {
    slug: "crimson-chip", name: "Crimson Chip", rating: 81, license: "Curaçao eGaming", minDeposit: 5,
    shortDesc: "Casino crypto-friendly : Bitcoin, Ethereum et USDT acceptés, retraits quasi instantanés.",
    pros: ["Crypto acceptée", "Retraits instantanés", "Dépôt dès 5 €"], cons: ["Licence moins stricte"],
    categories: ["casinos-crypto", "paiement-rapide", "bonus-sans-depot"],
    bonuses: [{ name: "10 € offerts à l'inscription", promocode: "CHIP10" }, { name: "Bonus crypto 120% jusqu'à 1 BTC", promocode: "BTC120" }],
  },
  {
    slug: "aurora-bet", name: "Aurora Bet", rating: 78, license: "Malta Gaming Authority", minDeposit: 10,
    shortDesc: "Plateforme mixte casino et paris sportifs avec un programme de fidélité à points.",
    pros: ["Casino + sport", "Programme de fidélité"], cons: ["Catalogue live limité"],
    categories: ["meilleurs-casinos"],
    bonuses: [{ name: "Freebet 25 € + 100 tours gratuits", promocode: "AURORA25" }],
  },
  {
    slug: "monte-carlo-club", name: "Monte Club", rating: 74, license: "Gibraltar Regulatory Authority", minDeposit: 30,
    shortDesc: "Casino élégant inspiré de Monaco, orienté joueurs réguliers et tables à limites élevées.",
    pros: ["Tables haute limite", "Conciergerie VIP"], cons: ["Dépôt minimum élevé", "Peu de promotions"],
    categories: ["casinos-live"],
    bonuses: [],
  },
];

const articles = [
  {
    slug: "comment-choisir-un-casino-en-ligne-fiable", title: "Comment choisir un casino en ligne fiable en 2026",
    categories: ["guides", "meilleurs-casinos"],
    body: `Choisir un casino en ligne ne se résume pas à comparer des bonus. Voici les critères à vérifier avant de déposer le moindre euro.

## 1. La licence

Un opérateur sérieux affiche sa **licence** en bas de page : Malta Gaming Authority, UK Gambling Commission ou Gibraltar. Vérifiez le numéro sur le site du régulateur.

## 2. Les moyens de paiement

- Carte bancaire, virement, portefeuilles électroniques
- Délais de retrait annoncés (idéalement moins de 48 h)
- Limites de retrait mensuelles

## 3. Les conditions de mise

Un bonus de 500 € avec une mise de 60x est rarement avantageux. Cherchez des conditions **inférieures à 40x** et lisez la liste des jeux exclus.

## 4. Le jeu responsable

Limites de dépôt, auto-exclusion et liens vers des associations d'aide sont des signes de sérieux.

> Jouer comporte des risques : endettement, isolement, dépendance. Appelez le 09 74 75 13 13 (appel non surtaxé).`,
  },
  {
    slug: "bonus-sans-depot-mode-d-emploi", title: "Bonus sans dépôt : mode d'emploi et pièges à éviter",
    categories: ["bonus-sans-depot", "guides"],
    body: `Un **bonus sans dépôt** vous permet de tester un casino sans risquer votre argent. Mais il y a des règles.

## Comment l'obtenir ?

1. Créez un compte et vérifiez votre e-mail
2. Entrez le code promo si nécessaire
3. Le bonus est crédité automatiquement

## Les pièges classiques

- **Plafond de gains** : souvent limité à 50 ou 100 €
- **Mise maximale** par tour pendant le wagering
- **Délai de validité** : parfois 7 jours seulement

Lisez toujours les conditions générales avant d'activer une offre.`,
  },
  {
    slug: "top-machines-a-sous-rtp-eleve", title: "Les machines à sous au meilleur RTP",
    categories: ["machines-a-sous", "guides"],
    body: `Le **RTP** (Return To Player) est le pourcentage moyen des mises redistribué aux joueurs sur le long terme.

| Type de jeu | RTP moyen |
|---|---|
| Machine à sous classique | 94 – 96% |
| Machine à sous à haute volatilité | 95 – 97% |
| Blackjack (stratégie de base) | 99%+ |

## Volatilité

Une volatilité **élevée** signifie des gains rares mais importants ; une volatilité **faible** donne des gains fréquents mais modestes.

Choisissez selon votre budget et votre tolérance au risque.`,
  },
  {
    slug: "casinos-crypto-guide-complet", title: "Casinos crypto : guide complet pour débutants",
    categories: ["casinos-crypto", "guides"],
    body: `Les casinos acceptant Bitcoin, Ethereum et USDT séduisent par leur rapidité et leur discrétion.

## Avantages

- Retraits en quelques minutes
- Frais réduits
- Bonus spécifiques aux cryptomonnaies

## Risques

La volatilité des cours peut modifier la valeur de vos gains entre deux sessions. Utilisez des **stablecoins** si vous souhaitez limiter ce risque.`,
  },
  {
    slug: "casino-live-conseils-debutants", title: "Casino live : 7 conseils pour bien débuter",
    categories: ["casinos-live", "guides"],
    body: `Les tables avec croupier en direct recréent l'ambiance d'un vrai casino depuis chez vous.

1. Commencez par des tables à petites mises
2. Apprenez la stratégie de base du blackjack
3. Fixez un budget et une limite de temps
4. Évitez les paris annexes à fort avantage maison
5. Profitez des tables en français
6. Testez la connexion avant de jouer
7. Faites des pauses régulières`,
  },
];

async function seedAdmin() {
  const email = process.env.NEXT_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.NEXT_ADMIN_PASSWORD || "AdminPass404";
  const password_hash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password: password_hash, role: "ADMIN" },
  });
  console.log(`Admin ready: ${email}`);
}

async function seedCategories() {
  const bySlug = {};
  for (const c of categories) {
    bySlug[c.slug] = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: { slug: c.slug, name: c.name },
    });
  }
  for (const c of categories.filter((x) => x.parent)) {
    await prisma.category.update({ where: { slug: c.slug }, data: { parentId: bySlug[c.parent].id } });
  }
  return bySlug;
}

async function seedCasinos(cats) {
  const result = [];
  for (const c of casinos) {
    const data = {
      name: c.name, rating: c.rating, license: c.license, minDeposit: c.minDeposit,
      shortDesc: c.shortDesc, pros: c.pros, cons: c.cons, logoUrl: `/casinos/${c.slug}.svg`,
      categories: { set: [], connect: c.categories.map((s) => ({ id: cats[s].id })) },
    };
    const casino = await prisma.casino.upsert({
      where: { slug: c.slug },
      update: data,
      create: { ...data, slug: c.slug, categories: { connect: c.categories.map((s) => ({ id: cats[s].id })) } },
    });

    // links and bonuses are rebuilt so the seed stays idempotent
    await prisma.affiliateLink.deleteMany({ where: { casinoId: casino.id } });
    await prisma.bonus.deleteMany({ where: { casinoId: casino.id } });
    const link = await prisma.affiliateLink.create({
      data: {
        casinoId: casino.id, network: "DemoAffiliates", isPrimary: true,
        baseUrl: `https://example.com/go/${c.slug}`, subTemplate: "s1={clickId}&src={source}&gclid={gclid}",
      },
    });
    for (const b of c.bonuses) {
      await prisma.bonus.create({
        data: { casinoId: casino.id, name: b.name, promocode: b.promocode, bonusUrl: `https://example.com/bonus/${c.slug}` },
      });
    }
    result.push({ casino, link });
  }
  return result;
}

async function seedArticles(cats) {
  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: { title: a.title, bodyMd: a.body, published: true, categories: { set: a.categories.map((s) => ({ id: cats[s].id })) } },
      create: { slug: a.slug, title: a.title, bodyMd: a.body, published: true, categories: { connect: a.categories.map((s) => ({ id: cats[s].id })) } },
    });
  }
}

async function seedClicks(items) {
  await prisma.click.deleteMany({ where: { casinoId: { in: items.map((i) => i.casino.id) } } });
  const sources = ["seo", "seo", "seo", "google-ads", "newsletter", "telegram"];
  const agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) Safari/604.1",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Firefox/131.0",
    "Mozilla/5.0 (Linux; Android 14) Chrome/130.0 Mobile Safari/537.36",
  ];
  const weights = items.map((_, i) => items.length - i); // better rated => more clicks
  const total = weights.reduce((a, b) => a + b, 0);
  const rows = [];
  for (let i = 0; i < 420; i++) {
    let r = Math.random() * total;
    let idx = 0;
    while (r > weights[idx]) { r -= weights[idx]; idx++; }
    const { casino, link } = items[idx];
    const source = sources[Math.floor(Math.random() * sources.length)];
    rows.push({
      id: crypto.randomUUID(), casinoId: casino.id, linkId: link.id, source,
      gclid: source === "google-ads" ? crypto.randomBytes(8).toString("hex") : null,
      ipHash: crypto.randomBytes(16).toString("hex"),
      userAgent: agents[Math.floor(Math.random() * agents.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 3600 * 1000)),
    });
  }
  await prisma.click.createMany({ data: rows });
}

async function main() {
  await seedAdmin();
  const cats = await seedCategories();
  const items = await seedCasinos(cats);
  await seedArticles(cats);
  await seedClicks(items);
  console.log("Demo data seeded.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
