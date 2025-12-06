import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret");
const RATE_PER_REF = 10; // $10 за реферала

export async function GET() {
    const token = (await cookies()).get('aff_token')?.value;
    if (!token) return NextResponse.json({ error: 'Auth required' }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.id as string;

        const user = await prisma.affiliateUser.findUnique({
            where: { id: userId },
            include: { referrals: true }
        });

        if (!user) throw new Error("User not found");

        const confirmedCount = user.referrals.filter(r => r.confirmed).length;
        const balance = confirmedCount * RATE_PER_REF;

        return NextResponse.json({
            username: user.username,
            avatar: user.avatar,
            referralCode: user.referralCode,
            stats: {
                total: user.referrals.length,
                confirmed: confirmedCount,
                balance: balance
            }
        });

    } catch (e) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}