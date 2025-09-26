export async function loadData(count, selectedUniversum) {
    let url = "http://localhost:3000/get-marvelEntries";
    if (selectedUniversum) {
        url += `?universum=${encodeURIComponent(selectedUniversum)}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    const container = document.getElementById("tableTwo");
    container.innerHTML = "";

    // 1️⃣ Daten nach Universum gruppieren
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.universum]) acc[item.universum] = [];
        acc[item.universum].push(item);
        return acc;
    }, {});

    // 2️⃣ Tabellen rendern
    for (const [universum, entries] of Object.entries(groupedData)) {
        const header = document.createElement("h2");
        header.innerText = universum;
        container.appendChild(header);

        const divTable = document.createElement("div");
        divTable.style.display = "flex";
        divTable.style.flexDirection = "column";
        container.appendChild(divTable);

        entries.forEach((item) => {
            const divRow = document.createElement("div");
            divRow.style.display = "flex";
            divRow.style.width = "100%";

            const arr = [item.position, item.title, item.date];
            const widths = ["10%", "70%", "20%"];

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
                    color: "black",
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
                const oldValues = [item.position, item.title, item.date];

                columns.forEach((col, index) => {
                    const oldValue = col.innerText;
                    col.innerText = "";

                    let input;


                        // Normales Textfeld für andere Spalten
                        input = document.createElement("input");
                        input.type = "text";
                        input.value = oldValue;


                    input.style.width = "95%";
                    col.appendChild(input);
                    inputs.push(input);
                });

                inputs.forEach((input) => {
                    input.addEventListener("keydown", (e) => {
                        if (e.key === "Enter") {
                            const fields = ["position","title", "date"];
                            const newData = {};

                            inputs.forEach((inp, i) => {
                                if (inp.value !== oldValues[i]) {
                                    newData[fields[i]] = inp.value; // nur geänderte Werte übernehmen
                                }
                            });

                            if (Object.keys(newData).length === 0) {
                                alert("Keine Änderungen vorgenommen.");
                                loadData(count, selectedUniversum);
                                return;
                            }

                            fetch(`http://localhost:3000/update-marvelEntry/${item.id}`, {
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
                                    loadData(count, selectedUniversum);
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
                fetch(`http://localhost:3000/delete-marvelEntry/${item.id}`, {
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


            divActions.appendChild(updateIcon);
            divActions.appendChild(deleteIcon);


// Einheitliches Styling wie die anderen Spalten
            Object.assign(divActions.style, {
                border: "1px solid grey",
                color: "black",
                padding: "2px",
            });

            divRow.appendChild(divActions);

            count++;
            if (count % 2 === 0) {
                divRow.style.background = "lightcoral";
            }
            container.appendChild(divRow);
        });
    }
}
