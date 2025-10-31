import { createCasino } from "../actions";

export default function NewCasino() {
    return (
        <div className="FormPage">
            <form action={createCasino} className="base__form">
                <h2>Добавить Казино</h2>

                <input name="name" placeholder="Casino name" required />
                <input name="slug" placeholder="Slug" required />
                <input name="license" placeholder="License" />
                <textarea name="shortDesc" placeholder="Description" />
                <button className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
            </form>
        </div>
    );
}
