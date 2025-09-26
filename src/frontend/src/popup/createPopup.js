const field = document.getElementById("field");

const title = document.createElement("input");
title.id = "titleInput";
title.placeholder = "title *";
Object.assign(title.style, {
    border: "1px solid grey",
    width: "100%",
    boxSizing: "border-box",
})

const description = document.createElement("textarea");
description.id = "descriptionInput";
description.placeholder = "description";
Object.assign(description.style, {
    border: "1px solid grey",
    width: "100%",
    boxSizing: "border-box",
    height: "100Px",
    resize: "none",
});

const viewing = document.createElement("input");
viewing.id = "viewingYearInput";
viewing.placeholder = "viewing-year";
Object.assign(viewing.style, {
    border: "1px solid grey",
    width: "25%",
})

field.appendChild(title);
field.appendChild(description);
field.appendChild(viewing);

// Warten, bis DOM geladen ist, dann Inputs für Navigation vorbereiten
document.addEventListener("DOMContentLoaded", () => {
    window.popupInputs = [
        document.getElementById("titleInput"),
        document.getElementById("descriptionInput"),
        document.getElementById("viewingYearInput"),
        document.getElementById("typInput"),
        document.getElementById("streamInput"),
        document.getElementById("box")
    ];
});