import * as api from "../../api.js";
import {$} from "../../ui/dom.js";
import {toastError} from "../../ui/toast.js";
import {initFilters} from "./filters.js";
import {renderEntries, renderHead} from "./table.js";
import {initAddPopup} from "./addPopup.js";
import {initActorPopup} from "./actorPopup.js";

const tableBox = $("#table");
let requestId = 0;

const filters = initFilters({onChange: reload});

async function reload() {
    const mine = ++requestId;
    try {
        const entries = await api.getEntries(filters.getParams());
        if (mine === requestId) renderEntries(tableBox, entries, reload); // veraltete Antworten verwerfen
    } catch (err) {
        toastError(err);
    }
}

renderHead($("#tableHead"));
initAddPopup({onSaved: reload});
initActorPopup({onSaved: () => {reload(); }});
reload();
