"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await signIn("credentials", { email, password, redirect: false });
        if (res?.error) setError("Неверный логин или пароль");
        else window.location.href = "/admin";
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h2>Вход в админку</h2>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} required />
                {error && <p className="text-red-600">{error}</p>}
                <button>Войти</button>
            </form>
        </div>
    );
}
