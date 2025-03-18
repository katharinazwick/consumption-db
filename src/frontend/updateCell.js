import {openPopup} from "./openPopUp.js";

export function edeting () {
    document.querySelectorAll(".childTable").forEach((oldElement) => {
        oldElement.addEventListener("dblclick", function () {
            openPopup()
            document.getElementById("titleInput").placeholder = "hallo";
            //console.log("den inhalt mit neuem eintrag abgleichen wenn neu überschreiben");
            console.log(oldElement.innerText);
        });
    });
}

