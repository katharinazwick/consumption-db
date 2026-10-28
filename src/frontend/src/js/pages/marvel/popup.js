import {el, $} from "../../ui/dom.js";
import {createModal} from "../../ui/modal.js";
import {toast, toastError} from "../../ui/toast.js";
import {UNIVERSES} from "../../config.js";
import * as api from "../../api.js";

/** "Add movie" für das Marvel-Universum: Titel, Jahr und je Universum die Position. */
export function initPopup({onSaved}) {
    const form = $("#addForm");
    const positions = $("#universumInputs");

    UNIVERSES.forEach((name) => positions.append(
        el("label", {class: "field"}, el("span", {textContent: name}),
            el("input", {type: "number", min: 1, name, placeholder: "position"}))));

    const modal = createModal($("#addOverlay"), {onSubmit: save, onOpen: () => form.reset()});

    async function save() {
        const title = $("#titleInput").value.trim();
        if (!title) return toast("Title darf nicht leer sein!", "error");

        const universum = [...positions.querySelectorAll("input")]
            .filter((input) => input.value.trim() !== "")
            .map((input) => ({universum: input.name, position: parseInt(input.value, 10)}));
        if (universum.some((u) => Number.isNaN(u.position))) return toast("Positionen müssen Zahlen sein!", "error");

        try {
            await api.addMarvelEntry({title, date: $("#dateInput").value.trim() || 0, universum});
            toast("Eintrag gespeichert");
            modal.close();
            onSaved();
        } catch (err) {
            toastError(err);
        }
    }

    $("#saveInput").addEventListener("click", save);
    $("#toAdd").addEventListener("click", modal.open);
}
