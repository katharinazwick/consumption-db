const add = document.getElementById("toAdd");
if(add){
    add.addEventListener("click", openPopup);
}

const close = document.getElementById("close");

if(close){
    close.addEventListener("click", closePopup);
}

function openPopup() {
    document.getElementById("popupOverlay").style.display = "block";
}
function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";
}