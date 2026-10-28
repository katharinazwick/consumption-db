import * as api from "../../api.js";
import {$, fillSelect} from "../../ui/dom.js";
import {toastError} from "../../ui/toast.js";
import {UNIVERSES} from "../../config.js";
import {renderEntries, renderHead} from "./table.js";
import {initPopup} from "./popup.js";

const universumSelect = $("#chooseUniversum");
fillSelect(universumSelect, UNIVERSES, "All universes");

let requestId = 0;
async function reload() {
    const mine = ++requestId;
    try {
        const entries = await api.getMarvelEntries(universumSelect.value);
        if (mine === requestId) renderEntries($("#table"), entries, reload);
    } catch (err) {
        toastError(err);
    }
}

universumSelect.addEventListener("change", reload);
renderHead($("#tableHead"));
initPopup({onSaved: reload});
reload();
