const field = document.getElementById("field");

const title = document.createElement("input");
title.id = "titleInput";
title.placeholder = "title *";
Object.assign(title.style, {
    border: "1px solid grey",
    width: "100%",
    boxSizing: "border-box",
})

const position = document.createElement("input");
position.id = "positionInput";
position.placeholder = "year";
Object.assign(position.style, {
    border: "1px solid grey",
    width: "25%",
})

const year = document.createElement("input");
year.id = "yearInput";
year.placeholder = "year";
Object.assign(year.style, {
    border: "1px solid grey",
    width: "25%",
})

field.appendChild(title);
field.appendChild(description);
field.appendChild(year);

// Warten, bis DOM geladen ist, dann Inputs für Navigation vorbereiten
document.addEventListener("DOMContentLoaded", () => {
    window.popupInputs = [
        document.getElementById("titleInput"),
        document.getElementById("positionInput"),
        document.getElementById("yearInput"),
        document.getElementById("universumInput"),
    ];
});