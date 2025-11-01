"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const toSlug = (v: unknown) => {
  if (typeof v !== "string") return v;
  return v.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
};

const articleSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Заголовок слишком короткий"),
  slug: z.preprocess(
    toSlug,
    z.string().min(2, "slug слишком короткий").regex(/^[a-z0-9-]+$/, "slug: только a-z, 0-9, -")
  ),
  bodyMd: z.string().trim().min(10, "Текст статьи должен быть ≥ 10 символов"),
  published: z.preprocess((v) => (v === undefined ? false : v), z.coerce.boolean()),
  categoryIds: z.array(z.string()).optional().default([]),
});

export async function createArticle(fd: FormData) {
  const parsed = articleSchema.safeParse({
    title: fd.get("title"),
    slug: fd.get("slug"),
    bodyMd: fd.get("bodyMd"),
    published: fd.get("published"),
    categoryIds: Array.from(fd.getAll("categoryIds") as string[]),
  });

  if (!parsed.success) {
    const msg = encodeURIComponent(
      parsed.error.issues.map((i) => i.message).join("; ")
    );
    redirect(`/admin/articles/new?error=${msg}`);
  }

  const p = parsed.data;

  await prisma.article.create({
    data: {
      title: p.title,
      slug: p.slug,
      bodyMd: p.bodyMd,
      published: p.published,
      categories: { connect: p.categoryIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function updateArticle(fd: FormData) {
  const parsed = articleSchema.safeParse({
    id: fd.get("id"),
    title: fd.get("title"),
    slug: fd.get("slug"),
    bodyMd: fd.get("bodyMd"),
    published: fd.get("published"),
    categoryIds: Array.from(fd.getAll("categoryIds") as string[]),
  });

  if (!parsed.success) {
    const msg = encodeURIComponent(
      parsed.error.issues.map((i) => i.message).join("; ")
    );
    const id = String(fd.get("id") || "");
    redirect(`/admin/articles/${id}?error=${msg}`);
  }

  const p = parsed.data;

  await prisma.article.update({
    where: { id: p.id! },
    data: {
      title: p.title,
      slug: p.slug,
      bodyMd: p.bodyMd,
      published: p.published,
      categories: { set: [], connect: p.categoryIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${p.id}`);
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin/articles");
}
