import { loadData } from "./table/outputTable.js";

const incomplete = document.getElementById("incomplete");
const favourite = document.getElementById("favourite");
const actor = document.getElementById("actor");
const chooseTyp = document.getElementById("chooseTyp");
const chooseStream = document.getElementById("chooseStream");
const chooseSort = document.getElementById("sort");

export function reloadTable() {
    loadData(chooseStream.value, incomplete.value, favourite.value, actor.value,chooseTyp.value, chooseSort.value);
}

//setzt bei neuladen alle filter auf initial
window.onload = function () {
    loadData(chooseStream.selectedIndex="", incomplete.selectedIndex="", favourite.selectedIndex="", actor.selectedIndex="",chooseTyp.selectedIndex="", chooseSort.value);
}
// Initiales Laden
reloadTable();

// Event-Listener für Filter
chooseStream.addEventListener("change", reloadTable);
incomplete.addEventListener("change", reloadTable);
favourite.addEventListener("change", reloadTable);
chooseTyp.addEventListener("change", reloadTable);
chooseSort.addEventListener("change", reloadTable);


