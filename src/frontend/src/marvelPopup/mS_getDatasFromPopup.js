import {closePopup} from "./mS_openPopup.js";

document.getElementById("saveInput").addEventListener("click", async () => {
    const title = document.getElementById("titleInput").value.trim();
    let date = document.getElementById("dateInput").value;
    if (date === "") {
        date = 0;
    }

    const universumContainer = document.getElementById("universumInput");
    const inputs = universumContainer.querySelectorAll("input");

    const universumData = [];

    inputs.forEach(input => {
        const value = input.value.trim();
        if (value !== "") {
            universumData.push({
                universum: input.id,      // Name des Universums
                position: parseInt(value) // Position als Zahl
            });
        }
    });

    if (!title) {
        alert("Title darf nicht leer sein!");
        return;
    }

    const data = {title, date, universum: universumData};

    const response = await fetch("http://localhost:3000/add-marvelEntry", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert("Fehler beim Speichern: " + (err.error || response.statusText));
        return;
    }

    const inserted = await response.json();
    closePopup();
    {
        console.error("Fehler:", error);
        alert("Server nicht erreichbar!");
    }
})
;

// ✅ Keyboard Navigation
document.addEventListener("keydown", (e) => {
    const overlay = document.getElementById("popupOverlay");
    if (overlay.style.display !== "block" || !window.popupInputs) return;

    if (e.key === "ArrowDown") {
        e.preventDefault();
        window.currentPopupIndex = (window.currentPopupIndex + 1) % window.popupInputs.length;
        window.popupInputs[window.currentPopupIndex].focus();
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        window.currentPopupIndex = (window.currentPopupIndex - 1 + window.popupInputs.length) % window.popupInputs.length;
        window.popupInputs[window.currentPopupIndex].focus();
    } else if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("saveInput").click();
    }
});