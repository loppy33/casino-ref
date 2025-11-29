"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { z as z2 } from "zod";

/* ----------------------------- Общие схемы ----------------------------- */

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const toSlug = (v: unknown) => {
  if (typeof v !== "string") return v;
  return v
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

/* --------------------------- Casino (существующий) --------------------------- */

const casinoSchema = z.object({
  id: z.string().optional(),

  name: z.string().trim().min(2, "Название слишком короткое"),
  slug: z.preprocess(
    toSlug,
    z.string().min(2).regex(/^[a-z0-9-]+$/, "slug: только a-z, 0-9, -")
  ),

  rating: z.preprocess(emptyToUndef, z.coerce.number().int().min(0).max(100).optional()),
  minDeposit: z.preprocess(emptyToUndef, z.coerce.number().int().min(0).optional()),

  license: z.preprocess(emptyToUndef, z.string().trim().optional()),
  shortDesc: z.preprocess(emptyToUndef, z.string().trim().max(600).optional()),

  logoUrl: z.preprocess(
    emptyToUndef,
    z.union([z.string().url(), z.string().startsWith("/")]).optional()
  ),

  is18plus: z.preprocess((v) => (v === undefined ? true : v), z.coerce.boolean()),

  pros: z.preprocess(emptyToUndef, z.string().optional()),
  cons: z.preprocess(emptyToUndef, z.string().optional()),

  categoryIds: z.array(z.string()).optional().default([]),
});

export async function createCasino(formData: FormData) {
  const parsed = casinoSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    rating: formData.get("rating"),
    license: formData.get("license"),
    minDeposit: formData.get("minDeposit"),
    is18plus: formData.get("is18plus"),
    logoUrl: formData.get("logoUrl"),
    shortDesc: formData.get("shortDesc"),
    pros: formData.get("pros"),
    cons: formData.get("cons"),
    categoryIds: Array.from(formData.getAll("categoryIds") as string[]),
  });

  await prisma.casino.create({
    data: {
      name: parsed.name,
      slug: parsed.slug,
      rating: parsed.rating ?? null,
      license: parsed.license || null,
      minDeposit: parsed.minDeposit ?? null,
      is18plus: parsed.is18plus,
      logoUrl: parsed.logoUrl || null,
      shortDesc: parsed.shortDesc || null,
      pros: (parsed.pros || "").split("\n").map((s) => s.trim()).filter(Boolean),
      cons: (parsed.cons || "").split("\n").map((s) => s.trim()).filter(Boolean),
      categories: { connect: parsed.categoryIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/casinos");
}

export async function updateCasino(formData: FormData) {
  const parsed = casinoSchema.parse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    rating: formData.get("rating"),
    license: formData.get("license"),
    minDeposit: formData.get("minDeposit"),
    is18plus: formData.get("is18plus"),
    logoUrl: formData.get("logoUrl"),
    shortDesc: formData.get("shortDesc"),
    pros: formData.get("pros"),
    cons: formData.get("cons"),
    categoryIds: Array.from(formData.getAll("categoryIds") as string[]),
  });

  await prisma.casino.update({
    where: { id: parsed.id! },
    data: {
      name: parsed.name,
      slug: parsed.slug,
      rating: parsed.rating ?? null,
      license: parsed.license || null,
      minDeposit: parsed.minDeposit ?? null,
      is18plus: parsed.is18plus,
      logoUrl: parsed.logoUrl || null,
      shortDesc: parsed.shortDesc || null,
      pros: (parsed.pros || "").split("\n").map((s) => s.trim()).filter(Boolean),
      cons: (parsed.cons || "").split("\n").map((s) => s.trim()).filter(Boolean),
      categories: {
        set: [],
        connect: parsed.categoryIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/admin/casinos");
  revalidatePath(`/admin/casinos/${parsed.id}`);
}

export async function deleteCasino(id: string) {
  await prisma.casino.delete({ where: { id } });
  revalidatePath("/admin/casinos");
}

/* --------------------------- AffiliateLink (вложенный CRUD) --------------------------- */

const linkSchema = z2.object({
  id: z2.string().optional(),
  casinoId: z2.string(),
  network: z2.string().min(2),
  baseUrl: z2.string().url(),
  subTemplate: z2.string().optional().nullable(),
  isPrimary: z2.coerce.boolean().optional().default(true),
});

export async function createLink(formData: FormData) {
  const parsed = linkSchema.parse({
    casinoId: formData.get("casinoId"),
    network: formData.get("network"),
    baseUrl: formData.get("baseUrl"),
    subTemplate: formData.get("subTemplate"),
    isPrimary: formData.get("isPrimary"),
  });

  await prisma.affiliateLink.create({
    data: {
      casinoId: parsed.casinoId,
      network: parsed.network,
      baseUrl: parsed.baseUrl,
      subTemplate: parsed.subTemplate || null,
      isPrimary: parsed.isPrimary,
    },
  });

  revalidatePath(`/admin/casinos/${parsed.casinoId}`);
}

export async function updateLink(formData: FormData) {
  const parsed = linkSchema.parse({
    id: formData.get("id"),
    casinoId: formData.get("casinoId"),
    network: formData.get("network"),
    baseUrl: formData.get("baseUrl"),
    subTemplate: formData.get("subTemplate"),
    isPrimary: formData.get("isPrimary"),
  });

  await prisma.affiliateLink.update({
    where: { id: parsed.id! },
    data: {
      network: parsed.network,
      baseUrl: parsed.baseUrl,
      subTemplate: parsed.subTemplate || null,
      isPrimary: parsed.isPrimary,
    },
  });

  revalidatePath(`/admin/casinos/${parsed.casinoId}`);
}

export async function deleteLink(id: string, casinoId: string) {
  await prisma.affiliateLink.delete({ where: { id } });
  revalidatePath(`/admin/casinos/${casinoId}`);
}

/* --------------------------------- Bonuses --------------------------------- */

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

const bonusSchema = z2.object({
  id: z2.string().optional(),
  casinoId: z2.string(),
  name: z2.string().trim().min(1, "Название обязательно"),
  bonusUrl: z2.preprocess(emptyToNull, z2.string().nullable().optional()),
  promocode: z2.preprocess(emptyToNull, z2.string().nullable().optional()),
});

export async function createBonus(formData: FormData) {
  const parsed = bonusSchema.safeParse({
    casinoId: String(formData.get("casinoId") || ""),
    name: formData.get("name"),
    bonusUrl: formData.get("bonusUrl"),
    promocode: formData.get("promocode"),
  });

  if (!parsed.success) {
    const msg = encodeURIComponent(parsed.error.issues.map((i) => i.message).join("; "));
    redirect(`/admin/casinos/${String(formData.get("casinoId") || "")}?error=${msg}`);
  }

  const p = parsed.data;

  await prisma.bonus.create({
    data: {
      casinoId: p.casinoId,
      name: p.name,
      bonusUrl: p.bonusUrl ?? null,
      promocode: p.promocode ?? null,
    },
  });

  revalidatePath(`/admin/casinos/${p.casinoId}`);
  redirect(`/admin/casinos/${p.casinoId}`);
}

export async function updateBonus(formData: FormData) {
  const parsed = bonusSchema.safeParse({
    id: formData.get("id"),
    casinoId: String(formData.get("casinoId") || ""),
    name: formData.get("name"),
    bonusUrl: formData.get("bonusUrl"),
    promocode: formData.get("promocode"),
  });

  if (!parsed.success) {
    const id = String(formData.get("id") || "");
    const casinoId = String(formData.get("casinoId") || "");
    const msg = encodeURIComponent(parsed.error.issues.map((i) => i.message).join("; "));
    redirect(`/admin/casinos/${casinoId}/bonuses/${id}?error=${msg}`);
  }

  const p = parsed.data;

  await prisma.bonus.update({
    where: { id: p.id! },
    data: {
      name: p.name,
      bonusUrl: p.bonusUrl ?? null,
      promocode: p.promocode ?? null,
    },
  });

  revalidatePath(`/admin/casinos/${p.casinoId}`);
  redirect(`/admin/casinos/${p.casinoId}`);
}

export async function deleteBonus(bonusId: string, casinoId?: string) {
  await prisma.bonus.delete({ where: { id: bonusId } });

  if (casinoId) revalidatePath(`/admin/casinos/${casinoId}`);
  revalidatePath("/admin/casinos");

  if (casinoId) redirect(`/admin/casinos/${casinoId}`);
  redirect("/admin/casinos");
}
