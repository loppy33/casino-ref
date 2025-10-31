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
        <div className="FormPage container">
            <form className="base__form" onSubmit={handleSubmit}>
                <h2>Админ панель</h2>
                <input className="main__input" type="text" placeholder="Логин" onChange={(e) => {setEmail(e.target.value); setError("")}} required />
                <input className="main__input" type="password" placeholder="Пароль" onChange={(e) => {setPassword(e.target.value); setError("")}} required />
                <div>
                    {error && <p className="error">{error}</p>}
                    <button>Войти</button>
                </div>
            </form>
        </div>
    );
}
