export async function loadData(chooseStream, incomplete, chooseTyp) {
//durchgucken und evt sachen köschen
    const paramsObj = {streamFilter : chooseStream, incompleteFilter : incomplete, typFilter : chooseTyp};
    const searchParams = new URLSearchParams(paramsObj);

    const response = await fetch(`http://localhost:3000/get-entries?${searchParams.toString()}`);
    const data = await response.json();

    const divTable = document.getElementById("table");
    divTable.innerHTML = "";

    const types = ["movie", "serie", "audiobook", "tale"];
    const prefixCount = "rowCount";
    const prefixDiv ="div"
    const dynamic = {};

    types.forEach((type) => {
        dynamic[prefixCount + type] = 1;
        dynamic[prefixDiv + type] = document.createElement("div");
    })

    data.forEach((item) => {
        const divRow = document.createElement("div");
        divRow.style.display = "flex";

        const arr = [item.title, item.viewingyear, item.stream, item.description];
        arr.forEach((value, index) => {
            const divColumn = document.createElement("div");
            divColumn.className = "childTable"
            divColumn.innerText = value;
            divColumn.style.padding ="2px";

            if (index === 3 && item.description) { // 3 = Index der description-Spalte
                const textContainer = document.createElement("div");
                textContainer.className = "expandable";
                textContainer.innerText = value;

                const toggleButton = document.createElement("div");
                toggleButton.className = "toggle-button";
                toggleButton.innerText = "more";
                toggleButton.style.cursor = "pointer";

                let expanded = false;
                toggleButton.addEventListener("click", () => {
                    expanded = !expanded;
                    textContainer.classList.toggle("expanded", expanded);
                    toggleButton.innerText = expanded ? "less" : "more";
                });
                divColumn.innerHTML = ""; // Sicherstellen, dass nichts überschrieben wird
                divColumn.appendChild(textContainer);
                divColumn.appendChild(toggleButton);
            }

            //divColumn.style.width = index === 0 ? "50%" : "20%";
            if(index === 0) divColumn.style.width = "50%"
            else if (index === 3) divColumn.style.width = "20%";
            else divColumn.style.width = "15%"


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

        dynamic[prefixCount + item.typ]++;
        if (dynamic[prefixCount + item.typ] % 2 === 0) divRow.style.background = "lightsteelblue";
        if (item.incomplete) divRow.style.background = "hotpink";
        dynamic[prefixDiv + item.typ].appendChild(divRow);
    })

    types.forEach((item) => {
        const headline = document.createElement("h2");
        headline.innerText = item +" "+ (dynamic[prefixCount + item] - 1);
        divTable.appendChild(headline);
        divTable.appendChild(dynamic[prefixDiv + item]);
    })
}

// Daten laden, sobald die Seite geladen wurde
//document.addEventListener("DOMContentLoaded", loadData);

