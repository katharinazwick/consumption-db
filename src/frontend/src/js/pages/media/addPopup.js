import {$, fillSelect} from "../../ui/dom.js";
import {createModal} from "../../ui/modal.js";
import {confirmAction} from "../../ui/confirm.js";
import {toast, toastError} from "../../ui/toast.js";
import {STREAMS, TYPES} from "../../config.js";
import * as api from "../../api.js";

/** "Add movie": Formular für einen neuen Eintrag. */
export function initAddPopup({onSaved}) {
    const form = $("#addForm");
    const field = (id) => $("#" + id);

    fillSelect(field("typInput"), TYPES);
    fillSelect(field("streamInput"), STREAMS, "stream");

    const modal = createModal($("#addOverlay"), {onSubmit: save, onOpen: () => form.reset()});

    async function save() {
        const title = field("titleInput").value.trim();
        if (!title) return toast("Title darf nicht leer sein!", "error");

        const favourite = field("favouriteBox").checked;
        const entry = {
            title,
            viewingYear: field("viewingYearInput").value.trim() || 0,
            stream: field("streamInput").value,
            typ: field("typInput").value,
            description: field("descriptionInput").value.trim(),
            favourite,
            // Ein Favorit gilt immer als abgeschlossen (wie bisher)
            completed: favourite || !field("incompleteBox").checked,
        };

        try {
            const check = await api.titleExists(title);
            if (check.exists && !await confirmAction(
                `Der Titel existiert bereits (${check.count}×). Typ: ${check.types.join(", ")}. Trotzdem speichern?`,
                {okLabel: "Save anyway"},
            )) return;

            await api.addEntry(entry);
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
