import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { forum, tone, keywords, refCode } = await req.json();
    const link = `https://casinosearch.fr/?ref=${refCode}`;

    let role = "";
    let context = "";
    let constraints = "";

    // 1. Настройка Роли (Persona)
    if (tone === "Hype") {
        role = "Agis comme un joueur passionné et excité qui vient de gagner une belle somme.";
        context = "Tu partages ta joie et ton expérience récente sur un forum.";
    } else if (tone === "Expert") {
        role = "Agis comme un expert en iGaming et analyste de casinos en ligne, très critique et pointilleux.";
        context = "Tu fais une analyse technique et objective pour aider la communauté.";
    } else if (tone === "Casual") {
        role = "Agis comme un internaute lambda, un peu sceptique mais curieux.";
        context = "Tu poses une question ou partages une découverte récente sans prétention.";
    } else if (tone === "Critique") {
        role = "Agis comme un joueur méfiant qui a testé beaucoup d'arnaques auparavant.";
        context = "Tu es surpris (en bien) par la rapidité de ce site, contrairement aux autres.";
    }

    // 2. Сборка Промпта
    // Мы даем инструкции на ФРАНЦУЗСКОМ, чтобы AI точно отвечал на французском.
    const masterPrompt = `
🎯 **Rôle :** ${role}
🌍 **Contexte :** Tu écris un post pour la plateforme "${forum}".
💬 **Ton :** ${tone} (Naturel, Humain, Non-robotique).

📝 **Tâche :**
Rédige un message court et percutant en FRANÇAIS.
Le sujet est ce site : ${link}
Tu dois intégrer ces éléments de manière fluide : "${keywords}".

⛔ **Contraintes strictes :**
1. Ne ressemble PAS à une publicité. Ça doit avoir l'air d'un vrai témoignage.
2. Utilise le vocabulaire et l'argot typique de "${forum}".
3. N'utilise pas de phrases marketing (ex: "Le meilleur casino du monde").
4. Insère le lien de manière discrète ou comme une recommandation personnelle.
5. Fais des fautes de frappe mineures ou utilise des abréviations si le style le demande (ex: "st", "pk", "mdr") pour faire vrai.

Génère UNIQUEMENT le texte du post, sans guillemets et sans introduction.
`.trim();

    return NextResponse.json({ prompt: masterPrompt });
}