import {reloadTable} from "./index.js";

const add = document.getElementById("toAdd");
if(add){
    add.addEventListener("click", openPopup);
}

const close = document.getElementById("close");

if(close){
    close.addEventListener("click", closePopup);
}

export function openPopup() {
    document.getElementById("popupOverlay").style.display = "block";
    // Alle Inputs zurücksetzen
    if (window.popupInputs) {
        window.popupInputs.forEach(input => {
            if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
                input.value = "";       // Wert löschen
            } else if (input.tagName === "SELECT") {
                input.selectedIndex = 0; // erstes Element auswählen
            }
        });
    }
    // Nach kurzem Delay erstes Feld fokussieren
    setTimeout(() => {
        if (window.popupInputs && window.popupInputs[0]) {
            window.popupInputs[0].focus();
            window.currentPopupIndex = 0;
        }
    }, 50);
}
export function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";
    reloadTable();
}