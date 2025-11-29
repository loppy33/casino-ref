"use client";

import { useEffect, useRef, useState } from "react";

type BonusDTO = {
    id: string;
    name: string;
    bonusUrl?: string | null;
    promocode?: string | null;
    casino: { id: string; name?: string | null };
    affiliateLinks: { id: string; baseUrl: string; subTemplate?: string | null }[];
};

const FIVE_MIN = 5 * 60; // 5 * 60 в продакшене
const STORAGE_KEY = "spin_timer_expires_at";

function getExpires(): number | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const n = Number(raw);
        if (Number.isNaN(n)) return null;
        return n;
    } catch {
        return null;
    }
}

export default function SpinBonus() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [secondsLeft, setSecondsLeft] = useState<number>(() => {
        const expires = typeof window !== "undefined" ? getExpires() : null;
        return expires ? Math.max(0, Math.floor((expires - Date.now()) / 1000)) : FIVE_MIN;
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [bonuses, setBonuses] = useState<BonusDTO[]>([]);
    const [spinning, setSpinning] = useState(false);
    const [preview, setPreview] = useState<BonusDTO | null>(null);
    const [finalSelected, setFinalSelected] = useState<BonusDTO | null>(null);

    const spinRef = useRef<number | null>(null);

    // Таймер
    const [ready, setReady] = useState(() => {
        const expires = getExpires();
        return !expires || expires <= Date.now();
    });

    // useEffect для синхронизации ready с таймером
    useEffect(() => {
        const id = setInterval(() => {
            const expires = getExpires();
            const rem = expires ? Math.max(0, Math.floor((expires - Date.now()) / 1000)) : 0;
            setSecondsLeft(rem);
            setReady(rem <= 0);
        }, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        return () => {
            if (spinRef.current) clearTimeout(spinRef.current);
        };
    }, []);

    function formatTime(sec: number) {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    // Резервируем слот сразу при нажатии на "Открыть"
    function reserveCooldown() {
        const expires = Date.now() + FIVE_MIN * 1000;
        try { localStorage.setItem(STORAGE_KEY, String(expires)); } catch { }
        setSecondsLeft(FIVE_MIN);
    }

    async function openModal() {
        const expires = getExpires();
        if (expires && expires > Date.now()) {
            alert(`Spin доступен через ${formatTime(Math.max(0, Math.floor((expires - Date.now()) / 1000)))}`);
            return;
        }

        if (bonuses.length === 0) {
            const res = await fetch("/api/bonuses", { cache: "no-store" });
            if (!res.ok) throw new Error("Failed");
            const data: BonusDTO[] = await res.json();
            setBonuses(data);
        }

        setPreview(null);
        setFinalSelected(null);
        setModalOpen(true);
    }

    async function doSpin() {
        if (spinning || bonuses.length === 0) return null;

        reserveCooldown(); // <-- блокируем сразу
        setSpinning(true);
        setPreview(null);
        setFinalSelected(null);

        const totalMs = 2500;
        const intervalStart = 50;
        const intervalEnd = 400;
        const start = performance.now();

        return new Promise<BonusDTO | null>((resolve) => {
            const tick = (t: number) => {
                const progress = Math.min(1, (t - start) / totalMs);
                const easedInterval = intervalStart + (intervalEnd - intervalStart) * (progress * progress);
                const rnd = bonuses[Math.floor(Math.random() * bonuses.length)];
                setPreview(rnd);

                if (t - start >= totalMs) {
                    const final = bonuses[Math.floor(Math.random() * bonuses.length)];
                    setPreview(final);
                    spinRef.current = window.setTimeout(() => {
                        setFinalSelected(final);
                        setSpinning(false);
                        resolve(final);
                    }, 200);
                    return;
                }

                spinRef.current = window.setTimeout(() => tick(performance.now()), easedInterval);
            };

            tick(performance.now());
        });
    }

    function goToBonus(b: BonusDTO | null) {
        if (!b) return;
        if (b.promocode) navigator.clipboard.writeText(b.promocode).catch(() => { });
        const target = b.bonusUrl ?? b.affiliateLinks?.[0]?.baseUrl ?? null;
        if (target) window.open(target, "_blank");
        setModalOpen(false);
    }

    const shown = spinning ? preview : finalSelected ?? preview;
    if (!mounted) return null;

    return (
        <>
            <div className="spin-floating-wrapper">
                <div
                    className={`spin-floating ${ready ? "spin-floating--ready" : ""}`}
                    onClick={() => { if (ready) openModal(); }}
                >
                    {!ready ? (
                        <>
                            <div className="spin-floating__label">Bonus disponible dans</div>
                            <div className="spin-floating__time">{formatTime(secondsLeft)}</div>
                        </>
                    ) : (
                        <div className="spin-floating__ready">Récupérer le bonus 🎁</div>
                    )}
                </div>
            </div>

            {modalOpen && (
                <div className="spin-modal" onClick={() => { if (!spinning) setModalOpen(false); }}>
                    <div className="spin-modal__content" onClick={e => e.stopPropagation()}>
                        <div className="spin-modal__title">Votre bonus personnalisé</div>
                        <div className="spin-modal__preview">
                            <div className="spin-preview-inner">
                                {shown ? (
                                    <div className={`spin-card ${spinning ? "spin-card--spinning" : "spin-card--final"}`}>
                                        <div className="spin-card__casino">{shown.casino?.name ?? "Exclusif"}</div>
                                        <div className="spin-card__title">{shown.name}</div>
                                        {!spinning && (
                                            shown.promocode && (
                                                <div className="spin-card__promo">
                                                    <div className="spin-card__promo-label">Code promo</div>
                                                    <div className="spin-card__promo-code">{shown.promocode}</div>
                                                </div>

                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="spin-placeholder">
                                        <span>Cliquez sur <b>Ouvrir</b> pour tenter votre chance</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="spin-actions">
                            {/* <button className="btn btn--ghost" onClick={() => { if (!spinning) setModalOpen(false); }} disabled={spinning}>
                                Fermer
                            </button> */}

                            {!finalSelected ? (
                                <button className="btn btn--primary" onClick={() => { if (!spinning) void doSpin(); }} disabled={spinning || bonuses.length === 0}>
                                    {spinning ? "Sélection en cours..." : "Ouvrir"}
                                </button>
                            ) : (
                                <button className="btn btn--success" onClick={() => goToBonus(finalSelected)}>
                                    {finalSelected.promocode ? "Copier et recevoir" : "Récupérer le bonus"}
                                </button>
                            )}
                        </div>

                        <div className="spin-meta">
                            {bonuses.length === 0 ? "Initialisation..." : "Provably Fair • Connexion sécurisée"}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}