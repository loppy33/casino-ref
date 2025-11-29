import { prisma } from "@/lib/db";
import { updateBonus, deleteBonus } from "../../../actions";
import Link from "next/link";

export default async function EditBonus({ params }: { params: { casinoId: string; id: string } }) {
    const { casinoId, id } = params;

    const bonus = await prisma.bonus.findUnique({ where: { id } });
    if (!bonus) return <div className="container">Бонус не найден</div>;

    return (
        <div className="FormPage container">
            <form action={updateBonus} className="base__form">
                <h2>Редактировать бонус</h2>
                <input type="hidden" name="id" defaultValue={bonus.id} />
                <input type="hidden" name="casinoId" defaultValue={casinoId} />

                <label>Название</label>
                <input name="name" defaultValue={bonus.name} required />

                <label>URL</label>
                <input name="bonusUrl" defaultValue={bonus.bonusUrl || ""} />

                <label>Промокод</label>
                <input name="promocode" defaultValue={bonus.promocode || ""} />

                <div className="form-actions">
                    <button className="primary__btn">Сохранить</button>
                </div>
            </form>

            <form
                action={async () => {
                    "use server";
                    await deleteBonus(bonus.id, casinoId);
                }}
                className="mt-4"
            >
                <button className="danger__btn">Удалить бонус</button>
            </form>
        </div>
    );
}
