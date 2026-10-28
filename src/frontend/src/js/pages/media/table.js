import {el} from "../../ui/dom.js";
import {confirmAction} from "../../ui/confirm.js";
import {iconButton, perform, startInlineEdit} from "../../ui/rowKit.js";
import {STREAMS, TYPES} from "../../config.js";
import * as api from "../../api.js";

const HEAD = ["title", "viewing year", "stream", "description", "options"];

/** Spaltenköpfe (einmal, sticky). Spaltenbreiten kommen aus .row in table.css. */
export function renderHead(container) {
    container.replaceChildren(...HEAD.map((text, i) => el("div", {class: `cell col-${i}`, textContent: text})));
}

/** Rendert die Einträge, gruppiert nach Typ. onChange lädt die Daten neu. */
export function renderEntries(container, entries, onChange) {
    const sections = TYPES.map((typ) => {
        const items = entries.filter((e) => e.typ === typ);
        return el("details", {class: "section", open: true},
            el("summary", {}, el("h2", {textContent: typ}), el("span", {class: "count", textContent: items.length})),
            el("div", {class: "rows"}, ...items.map((item) => createRow(item, onChange))),
        );
    });
    container.replaceChildren(...sections);

    // "more" nur zeigen, wenn der Text wirklich abgeschnitten ist
    requestAnimationFrame(() => container.querySelectorAll(".desc").forEach((d) => {
        d.nextElementSibling.hidden = d.scrollHeight <= d.clientHeight + 1 && !d.classList.contains("expanded");
    }));
}

function createRow(item, onChange) {
    const cells = [
        el("div", {class: "cell col-0", textContent: item.title}),
        el("div", {class: "cell col-1", textContent: item.viewingyear || "–"}),
        el("div", {class: "cell col-2", textContent: item.stream}),
        createDescriptionCell(item.description),
        el("div", {class: "cell col-4"}),
    ];
    const row = el("div", {class: "row" + (item.completed ? "" : " incomplete")}, ...cells);

    const edit = () => startInlineEdit(row, [
        {cell: cells[0], field: "title", value: item.title},
        {cell: cells[1], field: "viewingyear", value: item.viewingyear},
        {cell: cells[2], field: "stream", value: item.stream, options: STREAMS},
        {cell: cells[3], field: "description", value: item.description},
    ], {
        cancel: onChange,
        save: (changes) => perform(() => api.updateEntry(item.id, changes), "Eintrag aktualisiert", onChange),
    });

    cells[4].append(
        iconButton("🔄", "Status ändern", async () => {
            if (!await confirmAction("Willst du den Status ändern?")) return;
            perform(() => api.setCompleted(item.id, !item.completed), "Status geändert", onChange);
        }),
        iconButton("✏️", "Bearbeiten", edit),
        iconButton("🗑️", "Löschen", async () => {
            if (!await confirmAction("Willst du dieses Element wirklich löschen?")) return;
            perform(() => api.deleteEntry(item.id), "Eintrag gelöscht", onChange);
        }),
        iconButton(item.favourite ? "❤️" : "🩶️", item.favourite ? "Favorit entfernen" : "Als Favorit markieren", async () => {
            const question = item.favourite
                ? "Dieses Objekt ist schon als Favourite markiert. Willst du es demarkieren?"
                : "Willst du dieses Element als Favoriten markieren?";
            if (!await confirmAction(question)) return;
            perform(() => api.toggleFavourite(item.id), "Favorit aktualisiert", onChange);
        }),
    );
    return row;
}

function createDescriptionCell(text) {
    const cell = el("div", {class: "cell col-3"});
    if (!text) return cell;
    const desc = el("div", {class: "desc", textContent: text});
    const more = el("button", {type: "button", class: "more", textContent: "more", on: {
        click: () => more.textContent = desc.classList.toggle("expanded") ? "less" : "more",
    }});
    cell.append(desc, more);
    return cell;
}
