import { loadData } from "./table/outputTable.js";

const incomplete = document.getElementById("incomplete");
const chooseTyp = document.getElementById("chooseTyp");
const chooseStream = document.getElementById("chooseStream");
const chooseSort = document.getElementById("sort");

export function reloadTable() {
    loadData(chooseStream.value, incomplete.value, chooseTyp.value, chooseSort.value);
}

// Initiales Laden
reloadTable();

// Event-Listener für Filter
chooseStream.addEventListener("change", reloadTable);
incomplete.addEventListener("change", reloadTable);
chooseTyp.addEventListener("change", reloadTable);
chooseSort.addEventListener("change", reloadTable);


