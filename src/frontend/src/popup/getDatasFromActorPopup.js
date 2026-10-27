import {closeActorPopup, getSelectedActor} from "./actorPopUp.js";
import {loadActorFilter} from "../table/actorFilter.js";

document.getElementById("saveActor").addEventListener("click", async () => {
    const name = document.getElementById("actorNameInput").value.trim();
    if (!name) {
        alert("Name darf nicht leer sein!");
        return;
    }

    const movieIds = [...new Set(
        [...document.querySelectorAll("#actorMovies .movieSelect")]
            .map((s) => s.value)
            .filter((v) => v !== "")
    )];

    const actor = getSelectedActor();
    const payload = {actorId: actor ? actor.id : null, name, movieIds};

    try {
        const res = await fetch("http://localhost:3000/add-actor", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            await loadActorFilter();
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

document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("actorOverlay");
    if (overlay.style.display === "block" && e.key === "Enter") {
        e.preventDefault();
        document.getElementById("saveActor").click();
    }
});