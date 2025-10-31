"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCasino(formData: FormData) {
  await prisma.casino.create({
    data: {
      name: String(formData.get("name")),
      slug: String(formData.get("slug")),
      license: String(formData.get("license")),
      shortDesc: String(formData.get("shortDesc")),
    },
  });
  revalidatePath("/admin/casinos");
}
