import * as api from "../../api.js";
import {$} from "../../ui/dom.js";
import {toastError} from "../../ui/toast.js";
import {renderActors} from "./table.js";

let requestId = 0;
async function reload() {
    const mine = ++requestId;
    try {
        const actors = await api.getActorMovies();
        if (mine === requestId) renderActors($("#table"), actors, reload);
    } catch (err) {
        toastError(err);
    }
}

reload();
