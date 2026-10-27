import {closeActorPopup} from "./actorPopUp.js";

document.getElementById("saveActor").addEventListener("click", async () => {
    const name = document.getElementById("actorNameInput").value.trim();
    if (!name) {
        alert("Name darf nicht leer sein!");
        return;
    }

    // gewählte Film-IDs einsammeln, leere und doppelte raus
    const movieIds = [...new Set(
        [...document.querySelectorAll("#actorMovies .movieSelect")]
            .map((s) => s.value)
            .filter((v) => v !== "")
    )];

    try {
        const res = await fetch("http://localhost:3000/add-actor", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name, movieIds}),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            alert("Fehler beim Speichern: " + (err.error || res.statusText));
            return;
        }
        closeActorPopup();
    } catch (e) {
        console.error(e);
        alert("Server nicht erreichbar!");
    }
});

// Enter speichert, solange das Actor-Popup offen ist
document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("actorOverlay");
    if (overlay.style.display === "block" && e.key === "Enter") {
        e.preventDefault();
        document.getElementById("saveActor").click();
    }
});
