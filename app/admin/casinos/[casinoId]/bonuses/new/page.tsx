import { createBonus } from "../../../actions";
import { notFound } from "next/navigation";

type ParamsP = Promise<{ casinoId?: string | string[] } | undefined>;
const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v ?? "");

export default async function NewBonus({ params, }: { params: ParamsP; }) {
    const p = (await params) ?? {};
    const casinoId = first(p.casinoId);
    if (!casinoId) notFound();

    return (
        <div className="FormPage container">
            <form action={createBonus} className="base__form">
                <h2>Добавить бонус</h2>
                <input type="hidden" name="casinoId" defaultValue={casinoId} />
                
                <label>Название</label>
                <input name="name" required placeholder="200% Bonus up to €1,000 + 100 Free Spins on Starburst"/>

                <label>URL (опционально)</label>
                <input name="bonusUrl" placeholder="https://example.com/offerPromocode"/>

                <label>Промокод (опционально)</label>
                <input name="promocode" placeholder="CASINOSEARCH"/>

                <button className="primary__btn">Создать</button>
            </form>
        </div>
    );
}
