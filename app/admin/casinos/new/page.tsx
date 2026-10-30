// app/admin/casinos/new/page.tsx
import { prisma } from "@/lib/db";
import { createCasino } from "../actions";

export default async function NewCasino() {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="FormPage container">
            <form action={createCasino} className="base__form">
                <h2>Add casino</h2>

                <input name="name" placeholder="Name" required />
                <input name="slug" placeholder="slug (a-z0-9-)" required />
                <input name="license" placeholder="License (e.g. Curaçao ...)" />
                <input name="logoUrl" placeholder="Logo (URL)" />
                <input name="rating" type="number" min={0} max={100} placeholder="Rating (0..100)" />
                <input name="minDeposit" type="number" min={0} placeholder="Min. deposit" />

                <label className="checkbox">
                    <input type="checkbox" name="is18plus" defaultChecked /> 18+ only
                </label>

                <textarea name="shortDesc" placeholder="Short description (up to 600 chars)" />

                <div className="grid-2">
                    <div>
                        <label>Pros (one per line)</label>
                        <textarea name="pros" rows={6} />
                    </div>
                    <div>
                        <label>Cons (one per line)</label>
                        <textarea name="cons" rows={6} />
                    </div>
                </div>

                <fieldset>
                    <legend>Categories</legend>
                    <div className="checkbox-list">
                        {categories.map((cat: (typeof categories)[number]) => (
                            <label key={cat.id} className="checkbox">
                                <input type="checkbox" name="categoryIds" value={cat.id} />
                                {cat.name}
                            </label>
                        ))}
                    </div>
                </fieldset>

                <button className="primary__btn">Save</button>
            </form>
        </div>
    );
}
