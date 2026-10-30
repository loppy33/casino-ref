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
        if (res?.error) setError("Invalid username or password");
        else window.location.href = "/admin";
    }

    return (
        <div className="FormPage container">
            <form className="base__form" onSubmit={handleSubmit}>
                <h2>Admin panel</h2>
                <input className="main__input" type="text" placeholder="Username" onChange={(e) => {setEmail(e.target.value); setError("")}} required />
                <input className="main__input" type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value); setError("")}} required />
                <div>
                    {error && <p className="error">{error}</p>}
                    <button>Sign in</button>
                </div>
            </form>
        </div>
    );
}
