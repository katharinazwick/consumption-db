import {el} from "../../ui/dom.js";
import * as api from "../../api.js";

/**
 * Namensvorschläge beim Tippen (vorhandene Schauspieler).
 * onPick(actor) bei Auswahl, onType() sobald wieder getippt wird. Gibt hide() zurück.
 */
export function setupActorSuggestions({input, list, onPick, onType}) {
    let timer;

    const hide = () => {
        list.replaceChildren();
        list.classList.remove("open");
    };

    const render = (actors) => {
        if (actors.length === 0) return hide();
        list.replaceChildren(...actors.map((actor) => el("div", {
            class: "suggestion", textContent: actor.name,
            // mousedown statt click, sonst feuert vorher blur und die Liste ist weg
            on: {mousedown: (e) => { e.preventDefault(); input.value = actor.name; onPick(actor); hide(); }},
        })));
        list.classList.add("open");
    };

    input.addEventListener("input", () => {
        onType();
        clearTimeout(timer);
        const q = input.value.trim();
        if (!q) return hide();

        timer = setTimeout(async () => { // Debounce: erst 200 ms nach der letzten Eingabe anfragen
            try {
                const actors = await api.getActors(q);
                if (input.value.trim() === q) render(actors); // veraltete Antworten ignorieren
            } catch {
                hide();
            }
        }, 200);
    });

    input.addEventListener("blur", () => setTimeout(hide, 150));
    return hide;
}
