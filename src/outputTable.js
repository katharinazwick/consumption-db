export function loadData(data, choose, incomplete) {
    const divTable = document.getElementById("table");
    divTable.innerHTML = "";

    /*const types = ["movies", "series", "audiobooks"];
    const elements = {};*/

    const divMovie = document.createElement("div");
    const divSerie = document.createElement("div");

    let rowColorMovie = 1;
    let rowColorSerie = 1;

    data.forEach((item) => {
        const divRow = document.createElement("div");
        divRow.style.display = "flex";

        if (choose !== "stream" && item.stream !== choose) return;

        if (incomplete !== "all" && !item.incomplete) return

        const arr = [item.title, item.viewingyear, item.stream];
       arr.forEach((value, index) => {
            const divColumn = document.createElement("div");
            divColumn.className = "childTable"
            divColumn.innerText = value;
           divColumn.style.width = index === 0 ? "60%" : "20%";

            Object.assign(divColumn.style, {
                border: "1px solid grey",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "nowrap",
                color: "black",
            });

            divRow.appendChild(divColumn);
       })
        if (item.typ === "movie") {
            rowColorMovie++;
            if (rowColorMovie % 2 === 0) {
                divRow.style.background = "lightsteelblue";
            }
            if (item.incomplete) {
                divRow.style.background = "hotpink"
            }
            divMovie.appendChild(divRow);
        } else if (item.typ === "serie") {
            rowColorSerie++;
            if (rowColorSerie % 2 === 0) {
                divRow.style.background = "lightsteelblue";
            }
            if (item.incomplete) {
                divRow.style.background = "hotpink"
            }
            divSerie.appendChild(divRow);
        }
    })
    const empty = document.createElement("div");
    empty.style.height = "50px";

    divTable.appendChild(divMovie);
    divTable.appendChild(empty);
    divTable.appendChild(divSerie);
}

// Daten laden, sobald die Seite geladen wurde
//document.addEventListener("DOMContentLoaded", loadData);



