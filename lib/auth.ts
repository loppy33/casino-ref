// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// обёртка для получения сессии на сервере
export async function auth() {
  return await getServerSession(authOptions);
}

// guard for server actions: they are public POST endpoints, so the layout redirect is not enough
export async function requireAdmin() {
  const session = await auth();
  if (!session || (session as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}
