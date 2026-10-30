// app/out/[id]/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import crypto from "crypto";

type BuildOpts = { subTemplate?: string | null; params: Record<string, string> };

function buildUrl(baseUrl: string, { subTemplate, params }: BuildOpts) {
    const url = new URL(baseUrl);
    // добавим параметры сети, если шаблон задан
    if (subTemplate?.trim()) {
        // пример: "s1={clickId}&src={source}&gclid={gclid}"
        for (const pair of subTemplate.split("&")) {
            const [k, v] = pair.split("=");
            if (!k) continue;
            const key = k.trim();
            const raw = (v ?? "").trim();
            const nameInBraces = raw.match(/^\{(.+)\}$/)?.[1];
            const value = nameInBraces ? params[nameInBraces] ?? "" : raw;
            if (value !== "") url.searchParams.set(key, value);
        }
    }
    return url.toString();
}

function getIp(h: Headers) {
    return (
        h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        h.get("x-real-ip") ||
        ""
    );
}

function sha256(s: string) {
    return crypto.createHash("sha256").update(s).digest("hex");
}

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id?: string }> }
) {
    const { id } = await params; // linkId
    if (!id) return NextResponse.redirect(new URL("/", _req.url), 302);

    const h = await headers();
    // вытаскиваем возможные метки из исходного запроса
    const url = new URL(_req.url);
    const gclid = url.searchParams.get("gclid") || undefined;
    const gbraid = url.searchParams.get("gbraid") || undefined;
    const source = url.searchParams.get("source") || url.searchParams.get("src") || undefined;
    const ref = h.get("referer") || undefined;
    const ua = h.get("user-agent") || "";

    // ищем ссылку + казино
    const link = await prisma.affiliateLink.findUnique({
        where: { id },
        include: { casino: true },
    });
    if (!link) return NextResponse.redirect(new URL("/", _req.url), 302);

    // генерим clickId
    const clickId = crypto.randomUUID();

    // собираем финальный URL
    const finalUrl = buildUrl(link.baseUrl, {
        subTemplate: link.subTemplate,
        params: {
            clickId,
            source: source ?? "seo",
            gclid: gclid ?? "",
            gbraid: gbraid ?? "",
            ua,
            ref: ref ?? "",
            casinoId: link.casinoId,
            linkId: link.id,
        },
    });

    // лог клика
    const ip = getIp(h);
    const ipHash = ip ? sha256(ip + "|" + ua) : undefined;

    await prisma.click.create({
        data: {
            id: clickId,
            casinoId: link.casinoId,
            linkId: link.id,
            source,
            gclid,
            gbraid,
            ipHash,
            userAgent: ua,
        },
    });

    // 302 на оффер
    return NextResponse.redirect(finalUrl, 302);
}
