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
        <h2>New article</h2>

        {errorMsg && <div className="error__box">{errorMsg}</div>}

        <input name="title" placeholder="Title" required />
        <input name="slug" placeholder="slug (a-z0-9-)" required />
        <label className="checkbox">
          <input type="checkbox" name="published" /> Published
        </label>

        <fieldset>
          <legend>Categories</legend>
          <div className="checkbox-list">
            {categories.map((c: any) => (
              <label key={c.id} className="checkbox">
                <input type="checkbox" name="categoryIds" value={c.id} /> {c.name}
              </label>
            ))}
          </div>
        </fieldset>

        <textarea
          name="bodyMd"
          rows={14}
          placeholder="Markdown text (at least 10 characters)"
          required
        />

        <button className="primary__btn">Save</button>
      </form>
    </div>
  );
}
