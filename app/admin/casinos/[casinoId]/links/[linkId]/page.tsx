import { prisma } from "@/lib/db";
import { updateLink } from "../../../actions";

export default async function EditLink({
  params,
}: { params: { casinoId: string; linkId: string } }) {
  const link = await prisma.affiliateLink.findUnique({
    where: { id: params.linkId },
  });
  if (!link) return <div className="container">Ссылка не найдена</div>;

  return (
    <div className="FormPage container">
      <form action={updateLink} className="base__form">
        <h2>Редактировать ссылку</h2>
        <input type="hidden" name="id" defaultValue={link.id} />
        <input type="hidden" name="casinoId" defaultValue={params.casinoId} />
        <input name="network" defaultValue={link.network} required />
        <input name="baseUrl" defaultValue={link.baseUrl} required />
        <input name="subTemplate" defaultValue={link.subTemplate || ""} />
        <label className="checkbox">
          <input type="checkbox" name="isPrimary" defaultChecked={link.isPrimary} /> Primary
        </label>
        <button className="primary__btn">Сохранить</button>
      </form>
    </div>
  );
}
