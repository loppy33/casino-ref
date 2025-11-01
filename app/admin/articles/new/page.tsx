import { prisma } from "@/lib/db";
import { createArticle } from "../actions";

type SP = Promise<{ error?: string | string[] } | undefined>;

function getParamAsString(v: string | string[] | undefined) {
  if (Array.isArray(v)) return v[0];
  return v ?? "";
}

function decodePlusAndPercent(s: string) {
  try {
    return decodeURIComponent(s.replace(/\+/g, " "));
  } catch {
    return s.replace(/\+/g, " ");
  }
}

export default async function NewArticle({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = (await searchParams) ?? {};
  const rawError = getParamAsString(sp.error);
  const errorMsg = rawError ? decodePlusAndPercent(rawError) : "";

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="FormPage container">
      <form action={createArticle} className="base__form">
        <h2>Новая статья</h2>

        {errorMsg && <div className="error__box">{errorMsg}</div>}

        <input name="title" placeholder="Заголовок" required />
        <input name="slug" placeholder="slug (a-z0-9-)" required />
        <label className="checkbox">
          <input type="checkbox" name="published" /> Опубликована
        </label>

        <fieldset>
          <legend>Категории</legend>
          <div className="checkbox-list">
            {categories.map((c) => (
              <label key={c.id} className="checkbox">
                <input type="checkbox" name="categoryIds" value={c.id} /> {c.name}
              </label>
            ))}
          </div>
        </fieldset>

        <textarea
          name="bodyMd"
          rows={14}
          placeholder="Markdown-текст (минимум 10 символов)"
          required
        />

        <button className="primary__btn">Сохранить</button>
      </form>
    </div>
  );
}
