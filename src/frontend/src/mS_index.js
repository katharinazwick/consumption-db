import {loadData} from "./marvelTable/mS_outputTable.js";

const chooseUniversum = document.getElementById("chooseUniversum");

export function reloadTable() {
    loadData(0, chooseUniversum.value);
}

// Initiales Laden
reloadTable();

chooseUniversum.addEventListener("change", reloadTable);