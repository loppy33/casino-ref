"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const emptyToNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

const toSlug = (v: unknown) => {
  if (typeof v !== "string") return v;
  return v
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")      // пробелы -> "-"
    .replace(/[^a-z0-9-]/g, ""); // убрать недопустимые символы
};

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Название слишком короткое"),
  slug: z.preprocess(
    toSlug,
    z.string().min(2, "slug слишком короткий").regex(/^[a-z0-9-]+$/)
  ),
  parentId: z.preprocess(emptyToNull, z.string().nullable().optional()),
});

export async function createCategory(fd: FormData) {
  const parsed = categorySchema.safeParse({
    name: fd.get("name"),
    slug: fd.get("slug"),
    parentId: fd.get("parentId"),
  });

  if (!parsed.success) {
    const msg = encodeURIComponent(parsed.error.issues.map(i => i.message).join("; "));
    redirect(`/admin/categories/new?error=${msg}`);
  }

  const p = parsed.data;

  await prisma.category.create({
    data: { name: p.name, slug: p.slug, parentId: p.parentId ?? null },
  });

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(fd: FormData) {
  const parsed = categorySchema.safeParse({
    id: fd.get("id"),
    name: fd.get("name"),
    slug: fd.get("slug"),
    parentId: fd.get("parentId"),
  });

  if (!parsed.success) {
    const id = String(fd.get("id") || "");
    const msg = encodeURIComponent(parsed.error.issues.map(i => i.message).join("; "));
    redirect(`/admin/categories/${id}?error=${msg}`);
  }

  const p = parsed.data;

  await prisma.category.update({
    where: { id: p.id! },
    data: { name: p.name, slug: p.slug, parentId: p.parentId ?? null },
  });

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${p.id}`);
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
