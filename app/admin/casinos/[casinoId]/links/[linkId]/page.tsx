// app/admin/casinos/[casinoId]/links/[linkId]/page.tsx
import { prisma } from "@/lib/db";
import { updateLink } from "../../../actions";
import { notFound } from "next/navigation";

type ParamsP = Promise<{ casinoId?: string | string[]; linkId?: string | string[] } | undefined>;
const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v ?? "");

export default async function EditLink({
  params,
}: {
  params: ParamsP;
}) {
  // ✅ Разворачиваем Promise
  const p = (await params) ?? {};
  const casinoId = first(p.casinoId);
  const linkId = first(p.linkId);

  if (!linkId) notFound();

  const link = await prisma.affiliateLink.findUnique({
    where: { id: linkId },
  });

  if (!link) return <div className="container">Ссылка не найдена</div>;

  return (
    <div className="FormPage container">
      <form action={updateLink} className="base__form">
        <h2>Редактировать ссылку</h2>

        <input type="hidden" name="id" defaultValue={link.id} />
        <input type="hidden" name="casinoId" defaultValue={casinoId} />

        <input name="network" defaultValue={link.network} required />
        <input
          name="baseUrl"
          type="url"
          defaultValue={link.baseUrl}
          required
        />
        <input
          name="subTemplate"
          defaultValue={link.subTemplate || ""}
          placeholder="s1={clickId}&src={source}"
        />
        <label className="checkbox">
          <input
            type="checkbox"
            name="isPrimary"
            defaultChecked={link.isPrimary}
          />{" "}
          Primary
        </label>

        <button className="primary__btn">Сохранить</button>
      </form>
    </div>
  );
}
