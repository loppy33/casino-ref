// app/admin/casinos/new/page.tsx
import { prisma } from "@/lib/db";
import { createCasino } from "../actions";

export default async function NewCasino() {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="FormPage container">
            <form action={createCasino} className="base__form">
                <h2>Добавить казино</h2>

                <input name="name" placeholder="Название" required />
                <input name="slug" placeholder="slug (a-z0-9-)" required />
                <input name="license" placeholder="Лицензия (например, Curaçao ...)" />
                <input name="logoUrl" placeholder="Логотип (URL)" />
                <input name="rating" type="number" min={0} max={100} placeholder="Рейтинг (0..100)" />
                <input name="minDeposit" type="number" min={0} placeholder="Мин. депозит" />

                <label className="checkbox">
                    <input type="checkbox" name="is18plus" defaultChecked /> Только 18+
                </label>

                <textarea name="shortDesc" placeholder="Короткое описание (до 600 симв.)" />

                <div className="grid-2">
                    <div>
                        <label>Плюсы (каждый с новой строки)</label>
                        <textarea name="pros" rows={6} />
                    </div>
                    <div>
                        <label>Минусы (каждый с новой строки)</label>
                        <textarea name="cons" rows={6} />
                    </div>
                </div>

                <fieldset>
                    <legend>Категории</legend>
                    <div className="checkbox-list">
                        {categories.map((cat: (typeof categories)[number]) => (
                            <label key={cat.id} className="checkbox">
                                <input type="checkbox" name="categoryIds" value={cat.id} />
                                {cat.name}
                            </label>
                        ))}
                    </div>
                </fieldset>

                <button className="primary__btn">Сохранить</button>
            </form>
        </div>
    );
}
