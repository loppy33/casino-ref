export default function Stars({ rating100 = 0 }: { rating100?: number | null }) {
    const value = Math.max(0, Math.min(100, rating100 ?? 0));
    const full = Math.floor(value / 20);
    const hasHalf = value % 20 >= 10; // если захочешь половинки
    const total = 5;

    return (
        <div className="cp-rating" aria-label={`Note ${Math.round(value)}/100`}>
            {Array.from({ length: total }).map((_, i) => {
                const filled = i < full || (i === full && hasHalf);
                return (
                    <svg
                        key={i}
                        className={`cp-rating__star ${filled ? "is-filled" : ""}`}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        fill={filled ? "#0075ff" : "#9aa1b1"}

                    >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                );
            })}
            {/* <span className="cp-rating__text">{Math.round(value)}/100</span> */}
        </div>
    );
}