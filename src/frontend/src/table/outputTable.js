export async function loadData(chooseStream, incomplete, favourite, chooseTyp, chooseSort) {
//durchgucken und evt sachen köschen

    const paramsObj = {
        streamFilter: chooseStream,
        incompleteFilter: incomplete,
        favouriteFilter: favourite,
        typFilter: chooseTyp,
        sort: chooseSort
    };
    console.log(paramsObj);
    const searchParams = new URLSearchParams(paramsObj);

    const response = await fetch(`http://localhost:3000/get-entries?${searchParams.toString()}`);
    const data = await response.json();
    const divTable = document.getElementById("table");
    divTable.innerHTML = "";

    const types = ["movie", "serie", "audiobook", "tale"];
    const prefixCount = "rowCount";
    const prefixDiv = "div"
    const dynamic = {};

    types.forEach((type) => {
        dynamic[prefixCount + type] = 1;
        dynamic[prefixDiv + type] = document.createElement("div");
    })

    data.forEach((item) => {
        const divRow = document.createElement("div");
        divRow.style.display = "flex";

        const widths = ["50%", "10%", "10%", "20%", "10%"];

        const arr = [item.title, item.viewingyear, item.stream, item.description];
        arr.forEach((value, index) => {
            const divColumn = document.createElement("div");
            divColumn.className = "childTable"
            divColumn.innerText = value;
            divColumn.style.padding = "2px";

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
            divColumn.style.width = widths[index];


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

        // --- Neue Spalte für Edit/Delete Icons ---
        const divActions = document.createElement("div");
        divActions.className = "childTable"; // gleiche Klasse wie andere Spalten
        divActions.style.display = "flex";
        divActions.style.justifyContent = "center";
        divActions.style.alignItems = "center";
        divActions.style.gap = "10px";
        divActions.style.width = "10%"; // passend zur Tabelle

// 🔄 Status-Update (nur "completed" ändern)
        const editIcon = document.createElement("span");
        editIcon.innerText = "🔄";
        editIcon.style.cursor = "pointer";

        editIcon.addEventListener("click", () => {
            const confirmed = confirm("Willst du den Status ändern?");
            if (!confirmed) return;

            fetch(`http://localhost:3000/edit-entry/${item.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({completed: !item.completed}), // nur Status toggeln
            })
                .then(async (response) => {
                    let data;
                    try {
                        data = await response.json();
                    } catch {
                        data = {};
                    }

                    if (!response.ok) {
                        alert("Fehler beim Aktualisieren: " + (data.error || response.statusText));
                        return;
                    }

                    alert(data.message || "Status erfolgreich geändert!");
                    loadData(chooseStream, incomplete, favourite, chooseTyp, chooseSort);
                })
                .catch((err) => {
                    alert("Fehler beim Status ändern: " + err.message);
                });
        });


// ✏️ Zeilenbearbeitung (nur Textfelder, nur geänderte Werte senden)
        const updateIcon = document.createElement("span");
        updateIcon.innerText = "✏️";
        updateIcon.style.cursor = "pointer";

        updateIcon.addEventListener("click", () => {
            const columns = Array.from(divRow.querySelectorAll(".childTable")).filter(
                (col) => col !== divActions
            );

            const alreadyEditing = columns.some(col => col.querySelector("input"));
            if (alreadyEditing) return;

            const inputs = [];
            const oldValues = [item.title, item.viewingyear, item.stream, item.description];

            columns.forEach((col, index) => {
                const oldValue = col.innerText;
                col.innerText = "";

                let input;

                if (index === 2) { // 2 = Index für 'stream'
                    // Dropdown für Stream
                    input = document.createElement("select");
                    const allowedStreams = ["Disney", "Netflix", "Amazon", "Spotify", "Sonstiges"];
                    allowedStreams.forEach((s) => {
                        const option = document.createElement("option");
                        option.value = s;
                        option.innerText = s;
                        if (s === oldValue) option.selected = true;
                        input.appendChild(option);
                    });
                } else {
                    // Normales Textfeld für andere Spalten
                    input = document.createElement("input");
                    input.type = "text";
                    input.value = oldValue;
                }

                input.style.width = "95%";
                col.appendChild(input);
                inputs.push(input);
            });

            inputs.forEach((input) => {
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        const fields = ["title", "viewingyear", "stream", "description"];
                        const newData = {};

                        inputs.forEach((inp, i) => {
                            if (inp.value !== oldValues[i]) {
                                newData[fields[i]] = inp.value; // nur geänderte Werte übernehmen
                            }
                        });

                        if (Object.keys(newData).length === 0) {
                            alert("Keine Änderungen vorgenommen.");
                            loadData(chooseStream, incomplete, chooseTyp, chooseSort);
                            return;
                        }

                        fetch(`http://localhost:3000/update-entry/${item.id}`, {
                            method: "PUT",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify(newData),
                        })
                            .then(async (response) => {
                                let data;
                                try {
                                    data = await response.json();
                                } catch {
                                    data = {};
                                }

                                if (!response.ok) {
                                    alert("Fehler beim Aktualisieren: " + (data.error || response.statusText));
                                    return;
                                }

                                alert(data.message || "Eintrag erfolgreich aktualisiert!");
                                loadData(chooseStream, incomplete, favourite, chooseTyp, chooseSort);
                            })
                            .catch((err) => {
                                alert("Fehler beim Aktualisieren: " + err.message);
                            });
                    }
                });
            });
        });


// Papierkorb-Icon (Delete)
        const deleteIcon = document.createElement("span");
        deleteIcon.innerText = "🗑️";
        deleteIcon.style.cursor = "pointer";

        deleteIcon.addEventListener("click", () => {
            // Referenz auf die aktuelle Zeile
            const rowToDelete = divRow;
            const confirmed = confirm("Willst du dieses Element wirklich löschen?");
            if (!confirmed) return; // Abbrechen bei "Nein"

            // DELETE Request asynchron
            fetch(`http://localhost:3000/delete-entry/${item.id}`, {
                method: "DELETE",
            })
                .then(async (response) => {
                    let data;
                    try {
                        data = await response.json();
                    } catch {
                        data = {};
                    }

                    if (!response.ok) {
                        alert("Fehler beim Löschen: " + (data.error || response.statusText));
                        return;
                    }

                    alert(data.message || "Eintrag erfolgreich gelöscht!");
                    rowToDelete.remove();
                })
                .catch((err) => {
                    alert("Fehler beim Löschen: " + err.message);
                });

        });

// favourite
        const favouriteIcon = document.createElement("span");
        favouriteIcon.innerText = "🩶️";
        const isFavourite = item.favourite;
        if(isFavourite) favouriteIcon.innerText = "❤️";
        favouriteIcon.style.cursor = "pointer";
        favouriteIcon.addEventListener("click", () => {
            // Prüfen, ob das Item bereits favorisiert ist (setze voraus, dass item.favourite ein boolean ist)
            // Dynamischer Text je nach aktuellem Status
            const message = isFavourite
                ? "Dieses Objekt ist schon als Favourite markiert. Willst du es demarkieren?"
                : "Willst du dieses Element als Favoriten markieren?";

            const confirmed = confirm(message);
            if (!confirmed) return; // Abbrechen

            // FAVOURITE Request asynchron (PUT-Methode anpassen)
            fetch(`http://localhost:3000/editFavourite-entry/${item.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(async (response) => {
                    let data;
                    try {
                        data = await response.json();
                    } catch {
                        data = {};
                    }

                    if (!response.ok) {
                        alert(data.error || "Fehler beim Aktualisieren des Favoriten-Status.");
                        return;
                    }

                    alert(data.message || "Erfolgreich aktualisiert!");
                    loadData(chooseStream, incomplete, favourite, chooseTyp, chooseSort);

                    // Status im Frontend direkt umschalten (optional, für Live-Updates)
                    item.favourite = !item.favourite;

                    // Falls du z.B. das Icon optisch anpassen möchtest (Klasse hinzufügen/entfernen):
                    favouriteIcon.classList.toggle("active", item.favourite);
                })
                .catch((err) => {
                    alert("Fehler beim Markieren: " + err.message);
                });
        });


        divActions.appendChild(editIcon);
        divActions.appendChild(updateIcon);
        divActions.appendChild(deleteIcon);
        divActions.appendChild(favouriteIcon);

// Einheitliches Styling wie die anderen Spalten
        Object.assign(divActions.style, {
            border: "1px solid grey",
            color: "black",
            padding: "2px",
        });

        divRow.appendChild(divActions);


        dynamic[prefixCount + item.typ]++;
        if (dynamic[prefixCount + item.typ] % 2 === 0) divRow.style.background = "lightsteelblue";
        if (!item.completed) divRow.style.background = "hotpink";
        dynamic[prefixDiv + item.typ].appendChild(divRow);
    })

    types.forEach((item) => {
        const headline = document.createElement("h2");
        headline.innerText = item + " " + (dynamic[prefixCount + item] - 1);
        divTable.appendChild(headline);
        divTable.appendChild(dynamic[prefixDiv + item]);
    })
}

// Daten laden, sobald die Seite geladen wurde
//document.addEventListener("DOMContentLoaded", loadData);

