import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

function makeRefCode(name: string) {
    const clean = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toLowerCase();
    const rnd = Math.floor(1000 + Math.random() * 9000);
    return `${clean}${rnd}`;
}

export async function POST(req: Request) {
    const { username } = await req.json();
    const cleanName = username?.trim();

    if (!cleanName || cleanName.length < 3) {
        return NextResponse.json({ error: "Никнейм слишком короткий" }, { status: 400 });
    }

    let user = await prisma.affiliateUser.findFirst({
        where: { username: cleanName } // Ищем по нику
    });

    if (!user) {
        const avatar = `${Math.floor(Math.random() * 10)}.png`;
        user = await prisma.affiliateUser.create({
            data: {
                username: cleanName,
                referralCode: makeRefCode(cleanName),
                avatar: avatar
            }
        });
    }

    const token = await new SignJWT({ id: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30d')
        .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set('aff_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });

    return NextResponse.json({ success: true });
}