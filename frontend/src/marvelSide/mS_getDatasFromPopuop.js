import {closePopup} from "./mS_openPopup.js";

document.getElementById("saveMSInput").addEventListener("click", async () => {
    const title = document.getElementById("titleInput").value.trim();

console.log(title)

    if (!title) {
        alert("Title darf nicht leer sein!");
        return;
    }

    const data = {title, viewingYear, stream, typ, description, completed};
    try {
        // 1) Vorab: Titel-Check
        const checkRes = await fetch(
            `http://localhost:3000/title-exists?title=${encodeURIComponent(title)}`
        );
        const check = await checkRes.json();

        if (check.exists) {
            const confirmed = confirm(
                `Der Titel existiert bereits (${check.count}×). Typ: ${check.types.join(", ")}. Trotzdem speichern?`
            );
            if (!confirmed) {
                return; // Nutzer will kein Duplikat
            }
        }

        // 2) Jetzt wirklich speichern (es darf dupliziert werden)
        const payload = { title, viewingYear, stream, typ, description, completed };

        const response = await fetch("http://localhost:3000/add-entry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            alert("Fehler beim Speichern: " + (err.error || response.statusText));
            return;
        }

        const inserted = await response.json();
        closePopup();
    } catch (error) {
        console.error("Fehler:", error);
        alert("Server nicht erreichbar!");
    }
});

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