import { createLink } from "../../../actions";

// app/admin/casinos/links/new/[casinoId]/page.tsx
export default function NewLink({ params }: { params: { casinoId: string } }) {
  return (
    <div className="FormPage container">
      <form action={createLink} className="base__form">
        <h2>Новая партнёрская ссылка</h2>
        <input type="hidden" name="casinoId" defaultValue={params.casinoId} />
        <input name="network" placeholder="Сеть (например, Affise)" required />
        <input name="baseUrl" placeholder="http(s)://..." required />
        <input name="subTemplate" placeholder="s1={clickId}&src={source}" />
        <label className="checkbox"><input type="checkbox" name="isPrimary" defaultChecked /> Primary</label>
        <button className="primary__btn">Сохранить</button>
      </form>
    </div>
  );
}
