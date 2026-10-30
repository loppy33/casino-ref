// app/admin/casinos/links/new/[casinoId]/page.tsx
import { notFound } from "next/navigation";
import { createLink } from "../../../actions";

type ParamsP = Promise<{ casinoId?: string | string[] } | undefined>;
const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v ?? "");

export default async function NewLink({ params, }: { params: ParamsP; }) {
    const p = (await params) ?? {};
    const casinoId = first(p.casinoId);
    if (!casinoId) notFound();

    return (
        <div className="FormPage container">
            <form action={createLink} className="base__form">
                <h2>New affiliate link</h2>

                <input type="hidden" name="casinoId" defaultValue={casinoId} />

                <input name="network" placeholder="Network (e.g. Affise)" required />
                <input
                    name="baseUrl"
                    type="url"
                    placeholder="https://example.com/offer"
                    required
                />
                <input name="subTemplate" placeholder="s1={clickId}&src={source}" />
                <label className="checkbox">
                    <input type="checkbox" name="isPrimary" defaultChecked /> Primary
                </label>

                <button className="primary__btn">Save</button>
            </form>
        </div>
    );
}
