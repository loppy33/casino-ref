// app/api/bonuses/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    // Получаем все бонусы с казино и их партнерскими ссылками
    const bonuses = await prisma.bonus.findMany({
        include: {
            casino: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
            // Получаем ссылки, чтобы редиректить на affiliateLink.baseUrl если нужно
            // Берём несколько штук (включая isPrimary), клиент выберет первую подходящую
            // Prisma: affiliateLink relation называется 'links' в модели Casino, но у Bonus — casino -> links не через Bonus
            // Поэтому получаем affiliateLinks через казино отдельно:
        },
    });

    // Для каждой записи подгрузим affiliate links казино
    const casinoIds = Array.from(new Set(bonuses.map((b: any) => b.casinoId)));
    const links = await prisma.affiliateLink.findMany({
        where: { casinoId: { in: casinoIds } },
        orderBy: { isPrimary: "desc" }, // первыми — primary
    });

    // сгруппируем ссылки по casinoId
    const linkMap = new Map<string, { id: string; baseUrl: string; subTemplate?: string | null }[]>();
    for (const l of links) {
        const arr = linkMap.get(l.casinoId) ?? [];
        arr.push({ id: l.id, baseUrl: l.baseUrl, subTemplate: l.subTemplate });
        linkMap.set(l.casinoId, arr);
    }

    // Соберём ответ
    const out = bonuses.map((b: any) => ({
        id: b.id,
        name: b.name,
        bonusUrl: b.bonusUrl,
        promocode: b.promocode,
        casino: {
            id: b.casinoId,
            name: b.casino?.name ?? null,
        },
        affiliateLinks: linkMap.get(b.casinoId) ?? [],
    }));

    return NextResponse.json(out);
}
