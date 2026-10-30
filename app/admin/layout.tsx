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
                            Dashboard
                        </a>
                        <a href="/admin/categories">
                            Categories
                        </a>
                        <a href="/admin/casinos">
                            Casinos
                        </a>
                        <a href="/admin/articles">
                            Articles
                        </a>
                        <a href="/admin/clicks">Click log</a>
                    </nav>
                    <a href="/api/auth/signout" >
                        Sign out
                    </a>
                </div>
            </header>

            <main>{children}</main>
            <footer className="admin-footer">
                <AlertTriangle size={14} />
                <span>Data updated {new Date().toLocaleString("en-GB")}</span>
            </footer>
        </div>
    );
}
