import {el} from "./dom.js";
import {toast, toastError} from "./toast.js";

// Icon-Button für die Options-Spalte (Symbole bleiben Emojis wie bisher).
export const iconButton = (icon, title, onClick) =>
    el("button", {type: "button", class: "icon-btn", title, ariaLabel: title, textContent: icon, on: {click: onClick}});

// Führt eine API-Aktion aus, zeigt Erfolg/Fehler als Toast und ruft danach onDone auf.
export async function perform(action, successMessage, onDone) {
    try {
        const result = await action();
        toast(result?.message || successMessage);
        await onDone?.();
    } catch (err) {
        toastError(err);
    }
}

/**
 * Macht die Zellen einer Zeile editierbar.
 * columns: [{cell, field, value, options?}] – mit options wird ein <select> statt Textfeld gezeigt.
 * Enter sendet nur die geänderten Felder an save(changes), Esc bricht ab.
 */
export function startInlineEdit(row, columns, {save, cancel}) {
    if (row.classList.contains("editing")) return;
    row.classList.add("editing");

    const inputs = columns.map(({cell, value, options}) => {
        let input;
        if (options) {
            // Leerer Eintrag, damit ein unbekannter/leerer Wert nicht stillschweigend überschrieben wird
            input = el("select", {}, ...["", ...options].map((o) => el("option", {value: o, textContent: o || "–"})));
        } else {
            input = el("input", {type: "text"});
        }
        input.value = value ?? "";
        cell.replaceChildren(input);
        return input;
    });

    const submit = () => {
        const changes = {};
        columns.forEach(({field, value}, i) => {
            if (inputs[i].value !== String(value ?? "")) changes[field] = inputs[i].value;
        });
        if (Object.keys(changes).length === 0) {
            toast("Keine Änderungen vorgenommen.", "info");
            return cancel();
        }
        save(changes);
    };

    inputs.forEach((input) => input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") submit();
        if (e.key === "Escape") cancel();
    }));
    inputs[0].focus();
}
