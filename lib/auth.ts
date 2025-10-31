// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// обёртка для получения сессии на сервере
export async function auth() {
  return await getServerSession(authOptions);
}
