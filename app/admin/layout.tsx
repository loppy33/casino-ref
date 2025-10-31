// app/admin/layout.tsx
import { auth } from "@/lib/auth"; // <-- важно, чтобы auth был экспортирован из lib/auth.ts
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // получаем сессию
  const session = await auth();

  // если не админ — редиректим на /login
  if (!session || (session as any).role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen  text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-5 text-sm">
            <a href="/admin" className="hover:opacity-80">
              Дашборд
            </a>
            <a href="/admin/casinos" className="hover:opacity-80">
              Казино
            </a>
            <a href="/admin/articles" className="hover:opacity-80">
              Статьи
            </a>
          </nav>
          <a href="/api/auth/signout" className="text-sm hover:opacity-80">
            Выйти
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
