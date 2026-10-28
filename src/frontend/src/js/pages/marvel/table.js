import {el} from "../../ui/dom.js";
import {confirmAction} from "../../ui/confirm.js";
import {iconButton, perform, startInlineEdit} from "../../ui/rowKit.js";
import * as api from "../../api.js";

const HEAD = ["position", "title", "year", "options"];

export function renderHead(container) {
    container.replaceChildren(...HEAD.map((text, i) => el("div", {class: `cell col-${i}`, textContent: text})));
}

/** Rendert die Einträge gruppiert nach Universum. onChange lädt neu. */
export function renderEntries(container, entries, onChange) {
    const groups = Map.groupBy(entries, (e) => e.universum);
    container.replaceChildren(...[...groups].map(([universum, items]) =>
        el("section", {class: "section"},
            el("h2", {}, universum, el("span", {class: "count", textContent: items.length})),
            el("div", {class: "rows"}, ...items.map((item) => createRow(item, onChange))))));
}

function createRow(item, onChange) {
    const cells = [
        el("div", {class: "cell col-0", textContent: item.position}),
        el("div", {class: "cell col-1", textContent: item.title}),
        el("div", {class: "cell col-2", textContent: item.date || "–"}),
        el("div", {class: "cell col-3"}),
    ];
    const row = el("div", {class: "row"}, ...cells);

    cells[3].append(
        iconButton("✏️", "Bearbeiten", () => startInlineEdit(row, [
            {cell: cells[0], field: "position", value: item.position},
            {cell: cells[1], field: "title", value: item.title},
            {cell: cells[2], field: "date", value: item.date},
        ], {
            cancel: onChange,
            save: (changes) => perform(() => api.updateMarvelEntry(item.id, changes), "Eintrag aktualisiert", onChange),
        })),
        iconButton("🗑️", "Löschen", async () => {
            if (!await confirmAction("Willst du dieses Element wirklich löschen?")) return;
            perform(() => api.deleteMarvelEntry(item.id), "Eintrag gelöscht", onChange);
        }),
    );
    return row;
}
