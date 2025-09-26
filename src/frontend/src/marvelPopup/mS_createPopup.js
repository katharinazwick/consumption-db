const field = document.getElementById("field");

const title = document.createElement("input");
title.id = "titleInput";
title.placeholder = "title *";
Object.assign(title.style, {
    border: "1px solid grey",
    width: "100%",
    boxSizing: "border-box",
})

const date = document.createElement("input");
date.id = "dateInput";
date.placeholder = "date";
Object.assign(date.style, {
    border: "1px solid grey",
    width: "25%",
})

field.appendChild(title);
field.appendChild(date);

// Warten, bis DOM geladen ist, dann Inputs für Navigation vorbereiten
document.addEventListener("DOMContentLoaded", () => {
    window.popupInputs = [
        document.getElementById("titleInput"),
        document.getElementById("dateInput"),
        document.getElementById("universumInput"),
    ];
});