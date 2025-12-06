import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Простая проверка на Францию (заглушка, можно подключить geoip-lite)
function isFrance(ip: string) {
    // В реальном проекте используй geoip-lite
    return true; // Пока считаем всех французами для теста
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get('ref');

    // Редирект на главную
    const res = NextResponse.redirect(new URL('/', req.url));

    if (ref) {
        // Ставим куку реферала на 30 дней
        res.cookies.set('ref_code', ref, { maxAge: 60 * 60 * 24 * 30 });

        // Логика записи в БД
        try {
            const referrer = await prisma.affiliateUser.findUnique({ where: { referralCode: ref } });
            if (referrer) {
                const ip = req.headers.get("x-forwarded-for") || "unknown";

                // Записываем переход
                await prisma.referral.create({
                    data: {
                        referrerId: referrer.id,
                        referredIp: ip,
                        referredCountry: "FR" // В будущем брать из GeoIP
                    }
                });
            }
        } catch (e) {
            console.error("Track error", e);
        }
    }

    return res;
}