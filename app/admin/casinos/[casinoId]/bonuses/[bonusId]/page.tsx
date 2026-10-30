import { prisma } from "@/lib/db";
import { updateBonus, deleteBonus } from "../../../actions";
import { notFound } from "next/navigation";

type ParamsP = Promise<{ casinoId?: string | string[]; bonusId?: string | string[] } | undefined>;
const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v ?? "");


export default async function EditBonus({
    params,
}: {
    params: ParamsP;
}) {
    const p = (await params) ?? {};
    const casinoId = first(p.casinoId);
    const bonusId = first(p.bonusId);

    if (!bonusId) notFound();

    const bonus = await prisma.bonus.findUnique({
        where: { id: bonusId }
    });
    if (!bonus) return <div className="container">Bonus not found</div>;

    return (
        <div className="FormPage container">
            <form action={updateBonus} className="base__form">
                <h2>Edit bonus</h2>
                <input type="hidden" name="id" defaultValue={bonus.id} />
                <input type="hidden" name="casinoId" defaultValue={casinoId} />

                <label>Name</label>
                <input name="name" defaultValue={bonus.name} required />

                <label>URL</label>
                <input name="bonusUrl" defaultValue={bonus.bonusUrl || ""} />

                <label>Promo code</label>
                <input name="promocode" defaultValue={bonus.promocode || ""} />

                <div className="form-actions">
                    <button className="primary__btn">Save</button>
                </div>
            </form>

            <form
                action={async () => {
                    "use server";
                    await deleteBonus(bonus.id, casinoId);
                }}
                className="mt-4"
            >
                <button className="danger__btn">Delete bonus</button>
            </form>
        </div>
    );
}
