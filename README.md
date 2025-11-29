Запуск призмы студии: npx prisma studio
 npx prisma db seed  - Для создания админа

Перегенерируй sitemap и положи файлы в public/
Если используешь next-sitemap:
# в проекте
npx next-sitemap
# затем проверь files в public/: sitemap.xml, sitemap-0.xml и т.д.

<!-- Обновление бд -->

Тесты, ручная проверка.
npx prisma migrate dev --name add-user-nickname


На сервере
npx prisma generate

git push → на прод npx prisma migrate deploy.


<!-- Обновления на сервере -->
git pull
npm run build
pm2 restart all


<!-- Промпт для статей -->
Génère une article complète en français sur le sujet suivant : **{TEMA}**  
L’article doit être optimisé SEO pour apparaître en première page Google sur le marché français des casinos en ligne.

FOURNIS STRICTEMENT :
1) Un **titre court** et accrocheur
2) Un **slug court et élégant**, uniquement en minuscules et avec des tirets
3) Un **texte complet en Markdown**, structuré et prêt à être collé sur un site.  
   - Le texte doit être unique, naturel, informatif et adapté au SEO (E-E-A-T)  
   - Utilise H1/H2/H3  
   - Ajoute une introduction claire et une conclusion forte  
   - Ajoute un FAQ SEO  
   - Utilise un ton professionnel, crédible, expert du marché iGaming  
   - Insère des images sous la forme suivante :

     ![alt-text](PROMPT POUR GENERER L’IMAGE – décrire la scène, style moderne, orientation paysage, très haute qualité)

   - Toutes les images doivent être pertinentes pour le contenu  
   - Le texte doit être suffisamment long pour être bien référencé

OBJECTIF :
Créer un article qui attire du trafic organique sur les recherches liées aux casinos en ligne, aux bonus, aux jeux, aux comparatifs, et à la sécurité.

RENVOIE LE MARKDOWN SOUS FORME DE BLOC DE CODE.


<!-- еще один промпт минимум 1500 до 2000 слов-->

Tu es un expert SEO spécialisé dans l’iGaming, les casinos en ligne et le marché français.

Génère un article ULTRA COMPLET en français sur le sujet suivant : **{TEMA}**

EXIGENCES GÉNÉRALES :
- L’article doit obligatoirement contenir **1 500 à 2 000 mots minimum** (ou plus si nécessaire).
- Le texte doit être unique, expert, naturel, informatif et optimisé E-E-A-T.
- Style : professionnel, crédible, clair, adapté au public français.
- Le contenu doit cibler les mots-clés à forte et moyenne concurrence du secteur casino.
- Intègre naturellement des variantes de mots-clés pour maximiser le SEO.
- L’article doit impérativement intégrer **des liens internes vers les pages pertinentes du site CasinoSearch.fr**. 
  Les liens doivent être insérés naturellement dans le texte lorsque cela est logique.

PAGES DISPONIBLES POUR LES LIENS INTERNES (à utiliser si pertinent) :
- Accueil : https://casinosearch.fr
- Liste des casinos : https://casinosearch.fr/casinos
- Catégories : https://casinosearch.fr/categories
- Articles : https://casinosearch.fr/articles
- FAQ : https://casinosearch.fr/faq
- Jeu Responsable : https://casinosearch.fr/responsable-jeu
- Mentions légales : https://casinosearch.fr/mentions-legales
- Politique de confidentialité : https://casinosearch.fr/politique-confidentialite

IMPORTANT :
- L’IA doit **choisir les liens pertinents en fonction du sujet**, mais n’en ajouter que si cela apporte de la valeur.
- Ne pas spammer : 3 à 6 liens internes maximum par article, parfaitement intégrés.

FOURNIS STRICTEMENT :
1) **Un titre court et accrocheur**
2) **Un slug court, propre et optimisé SEO** (ex. “meilleurs-casinos-france-2025”)
3) **Un article complet en Markdown**, retourné *dans un seul bloc de code*

STRUCTURE OBLIGATOIRE DU MARKDOWN :

# Titre H1 principal

![illustration principale](PROMPT POUR GENERER L’IMAGE – scène moderne, casino en ligne, style réaliste, lumière douce, haute qualité, horizontal)

## Introduction
Un paragraphe naturel, clair, contenant les mots-clés principaux et éventuellement un lien interne pertinent.

## Section 1 — Présentation du sujet
Texte expert, détaillé, informatif.
![image](PROMPT POUR GENERER L’IMAGE – illustration liée à la section)

### Sous-section si nécessaire
Analyse ou explications supplémentaires.

## Section 2 — Analyse approfondie / Comparatif / Fonctionnement
Texte long et complet.
![image](PROMPT POUR GENERER L’IMAGE – illustration descriptive, moderne)
Inclure ici un lien interne pertinent vers par ex. /casinos ou /categories si cela fait sens.

## Section 3 — Conseils d’expert
Liste + explications, ton professionnel.
![image](PROMPT POUR GENERER L’IMAGE – concept visuel de conseils, design premium)
Inclure un lien interne s’il renforce l’information (ex. /responsable-jeu).

## Section 4 — Erreurs à éviter
Contenu long, pédagogique.

## Section 5 — Points importants pour les joueurs français
Parler réglementation, sécurité, protection des données, etc.
Possibilité d’intégrer un lien interne vers :  
- /responsable-jeu  
- /politique-confidentialite  
- /faq  

## FAQ SEO (au moins 6 questions)
Chaque réponse doit faire 3–5 lignes minimum.
Les questions doivent couvrir les recherches fréquentes autour du sujet.

## Conclusion
Résumé fort, ton expert, CTA discret et informatif (sans incitation au jeu).
Possibilité d’intégrer un dernier lien interne pertinent.

RESTRICTIONS :
- Aucune incitation à jouer ou parier.
- Ne mentionne aucune marque interdite.
- Le ton doit rester informatif, crédible et neutre.
- Toutes les images doivent être sous forme :
  ![alt](PROMPT POUR GENERER L’IMAGE)

OBJECTIF FINAL :
Créer la meilleure page disponible sur internet sur ce sujet afin d’atteindre le TOP 3 Google en France en 2025.
