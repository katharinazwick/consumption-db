import {setupActorSuggestions} from "./actorSuggestions.js";

const overlay = document.getElementById("actorOverlay");
const nameInput = document.getElementById("actorNameInput");
const moviesBox = document.getElementById("actorMovies");
const suggestionsBox = document.getElementById("actorSuggestions");
const hint = document.getElementById("actorHint");

let movies = [];          // [{id, title}]
let selectedActor = null; // {id, name} wenn ein vorhandener Schauspieler gewählt wurde

export const getSelectedActor = () => selectedActor;

// ---------- Vorschläge ----------
const hideSuggestions = setupActorSuggestions({
    input: nameInput,
    list: suggestionsBox,
    onPick: (actor) => {
        selectedActor = actor;
        hint.textContent = "neue Filme werden ergänzt";
    },
    onType: () => {
        selectedActor = null;
        hint.textContent = "";
    },
});

// ---------- Filme laden ----------
async function loadMovies() {
    const res = await fetch("http://localhost:3000/get-entries?typFilter=movie&sort=title ascending");
    movies = await res.json();
}

// ---------- Ein Select-Feld erzeugen ----------
export function createMovieSelect() {
    const row = document.createElement("div");
    row.className = "movieRow";

    const select = document.createElement("select");
    select.className = "movieSelect";

    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "movie";
    select.appendChild(empty);

    movies.forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = m.title;
        select.appendChild(opt);
    });

    select.addEventListener("change", () => {
        const rows = moviesBox.querySelectorAll(".movieRow");
        if (select.value !== "" && row === rows[rows.length - 1]) {
            createMovieSelect();
        }
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.addEventListener("click", () => {
        row.remove();
        if (moviesBox.children.length === 0) createMovieSelect();
    });

    row.appendChild(select);
    row.appendChild(remove);
    moviesBox.appendChild(row);
}

// ---------- Popup öffnen / schließen ----------
export async function openActorPopup() {
    overlay.style.display = "block";
    nameInput.value = "";
    selectedActor = null;
    hint.textContent = "";
    hideSuggestions();
    moviesBox.innerHTML = "";
    try {
        await loadMovies();
    } catch (e) {
        console.error(e);
        alert("Filme konnten nicht geladen werden!");
    }
    createMovieSelect();
    setTimeout(() => nameInput.focus(), 50);
}

export function closeActorPopup() {
    overlay.style.display = "none";
}

document.getElementById("toAddActor").addEventListener("click", openActorPopup);
document.getElementById("closeActor").addEventListener("click", closeActorPopup);
document.getElementById("addMovieSelect").addEventListener("click", createMovieSelect);