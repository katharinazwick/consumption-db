/*
    const response = await fetch(`http://localhost:3000/get-entries?${searchParams.toString()}`);
    const data = await response.json();

    const divTable = document.getElementById("table");
    divTable.innerHTML = "";
*/

export function loadData(count) {
    const data = [
        { position: 2, title: "Iron Man 2", universum: "MCU", year: 2002 },
        { position: 1, title: "Iron Man", universum: "MCU", year: 2001 },
        { position: 2, title: "Iron Man 2", universum: "MCU", year: 2002 },
        { position: 1, title: "Iron Man", universum: "SP", year: 2001 },
        { position: 2, title: "Iron Man 2", universum: "SP", year: 2002 },
        { position: 1, title: "Iron Man", universum: "SP", year: 2001 },
        { position: 2, title: "Iron Man 2", universum: "SP", year: 2002 },
        { position: 1, title: "Iron Man", universum: "MCU", year: 2001 },
        { position: 2, title: "Iron Man 2", universum: "MCU", year: 2002 }
    ];

    const container = document.getElementById("table");

    data.forEach((item) => {
        const divRow = document.createElement("div");
        divRow.style.display = "flex";
        divRow.style.width = "100%";

        const arr = [item.position, item.title, item.universum, item.year];
        const widths = ["10%", "40%", "20%", "20%"];

        arr.forEach((value, index) => {
            const divColumn = document.createElement("div");
            divColumn.className = "childTable";
            divColumn.innerText = value;
            divColumn.style.padding = "4px";
            divColumn.style.width = widths[index];

            Object.assign(divColumn.style, {
                border: "1px solid grey",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "black"
            });

            divRow.appendChild(divColumn);
        });

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !item.completed }), // nur Status toggeln
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
                    loadData(chooseStream, incomplete, chooseTyp, chooseSort);
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
                    const allowedStreams = ["Disney", "Netflix", "Amazon","Spotify", "Festplatte"];
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
                            headers: { "Content-Type": "application/json" },
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
                                loadData(chooseStream, incomplete, chooseTyp, chooseSort);
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
            console.log(item.id)
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


        divActions.appendChild(editIcon);
        divActions.appendChild(updateIcon);
        divActions.appendChild(deleteIcon);


// Einheitliches Styling wie die anderen Spalten
        Object.assign(divActions.style, {
            border: "1px solid grey",
            color: "black",
            padding: "2px",
        });

        divRow.appendChild(divActions);

        count ++;
        if (count % 2 === 0) {
            divRow.style.background = "lightcoral";
        }
        container.appendChild(divRow);
    });
}
