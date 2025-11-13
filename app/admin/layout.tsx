// app/admin/layout.tsx
import { auth } from "@/lib/auth"; // <-- важно, чтобы auth был экспортирован из lib/auth.ts
import { AlertTriangle } from "lucide-react";
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
        <div className="AdminLayout">
            <header>
                <div className="container">
                    <nav >
                        <a href="/admin">
                            Дашборд
                        </a>
                        <a href="/admin/categories">
                            Категории
                        </a>
                        <a href="/admin/casinos">
                            Казино
                        </a>
                        <a href="/admin/articles">
                            Статьи
                        </a>
                        <a href="/admin/clicks">Логи кликов</a>
                    </nav>
                    <a href="/api/auth/signout" >
                        Выйти
                    </a>
                </div>
            </header>

            <main>{children}</main>
            <footer className="admin-footer">
                <AlertTriangle size={14} />
                <span>Данные обновлены {new Date().toLocaleString("ru-RU")}</span>
            </footer>
        </div>
    );
}
