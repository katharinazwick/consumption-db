document.getElementById("saveInput").addEventListener("click", async () => {
    const title = document.getElementById("titleInput").value.trim();
    let viewingYear = document.getElementById("viewingYearInput").value;
    if (viewingYear === "") {
        viewingYear = 0;
    }
    const stream = document.getElementById("streamInput").value.trim();
    const typ = document.getElementById("typInput").value.trim();
    const description = document.getElementById("descriptionInput").value.trim();

    let incomplete = false;
    const box = document.getElementById("box");

    if (box.checked) {
        incomplete = true;
    }

    if (!title) {
        alert("Title darf nicht leer sein!");
        return;
    }

    const data = {title, viewingYear, stream, typ, description, incomplete};
    try {
        const response = await fetch("http://localhost:3000/add-entry", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error("Fehler:", error);
        alert("Server nicht erreichbar!");
    }
});
