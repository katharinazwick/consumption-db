import {el} from "../../ui/dom.js";
import {confirmAction} from "../../ui/confirm.js";
import {toast} from "../../ui/toast.js";
import {iconButton, perform} from "../../ui/rowKit.js";
import * as api from "../../api.js";

/** Rendert alle Schauspieler (bereits alphabetisch vom Backend) mit ihren Filmen. */
export function renderActors(container, actors, onChange) {
    if (actors.length === 0) {
        container.replaceChildren(el("p", {class: "empty", textContent: "No actors yet"}));
        return;
    }
    container.replaceChildren(...actors.map((actor) => createSection(actor, onChange)));
}

function createSection(actor, onChange) {
    const heading = el("h2", {});
    const showName = () => heading.replaceChildren(
        el("span", {class: "actor-name", textContent: actor.name}),
        el("span", {class: "count", textContent: actor.movies.length}),
        iconButton("✏️", "Namen bearbeiten", startEdit),
    );

    function startEdit() {
        const input = el("input", {type: "text", value: actor.name, ariaLabel: "Name"});
        const save = () => {
            const name = input.value.trim();
            if (name === actor.name) { toast("Keine Änderungen vorgenommen.", "info"); return showName(); }
            if (!name) { toast("Name darf nicht leer sein!", "error"); return input.focus(); }
            perform(() => api.updateActor(actor.id, {name}), "Name aktualisiert", onChange);
        };
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") showName();
        });
        heading.replaceChildren(input, iconButton("✔️", "Speichern", save), iconButton("✖️", "Abbrechen", showName));
        input.focus();
        input.select();
    }
    showName();

    return el("section", {class: "section"},
        heading,
        el("div", {class: "rows"}, ...actor.movies.map((movie) => createRow(actor, movie, onChange))));
}

function createRow(actor, movie, onChange) {
    return el("div", {class: "row"},
        el("div", {class: "cell col-0", textContent: movie.title}),
        el("div", {class: "cell col-1", textContent: movie.typ || "–"}),
        el("div", {class: "cell col-2"},
            iconButton("🗑️", "Film bei diesem Schauspieler entfernen", async () => {
                if (!await confirmAction(`„${movie.title}“ bei ${actor.name} entfernen?`)) return;
                perform(() => api.removeActorMovie(actor.id, movie.id), "Film entfernt", onChange);
            })));
}
