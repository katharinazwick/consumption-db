import {el, $} from "../../ui/dom.js";
import {createModal} from "../../ui/modal.js";
import {createSearchSelect} from "../../ui/searchSelect.js";
import {toast, toastError} from "../../ui/toast.js";
import {setupActorSuggestions} from "./actorSuggest.js";
import * as api from "../../api.js";

/** "Add actor": Name (mit Vorschlägen für bestehende Schauspieler) + beliebig viele durchsuchbare Film-Selects. */
export function initActorPopup({onSaved}) {
    const nameInput = $("#actorNameInput");
    const hint = $("#actorHint");
    const rowsBox = $("#actorMovies");

    let movieOptions = [];
    let selectedActor = null; // {id, name}, wenn ein vorhandener Schauspieler gewählt wurde

    const modal = createModal($("#actorOverlay"), {onSubmit: save, onOpen: reset});

    const hideSuggestions = setupActorSuggestions({
        input: nameInput,
        list: $("#actorSuggestions"),
        onPick: (actor) => { selectedActor = actor; hint.textContent = "Neue Filme werden bei diesem Schauspieler ergänzt."; },
        onType: () => { selectedActor = null; hint.textContent = ""; },
    });

    function addMovieRow() {
        const select = createSearchSelect({
            placeholder: "Choose movie or series",
            options: movieOptions,
            onChange: (value) => {
                // Sobald die letzte Zeile gefüllt ist, kommt automatisch eine neue
                if (value && row === rowsBox.lastElementChild) addMovieRow();
            },
        });
        const remove = el("button", {type: "button", class: "icon-btn", title: "Remove", textContent: "×", on: {click: () => {
            row.remove();
            if (!rowsBox.children.length) addMovieRow();
        }}});
        const row = el("div", {class: "movie-row"}, select.el, remove);
        row.select = select;
        rowsBox.append(row);
    }

    async function reset() {
        nameInput.value = "";
        selectedActor = null;
        hint.textContent = "";
        hideSuggestions();
        rowsBox.replaceChildren();
        try {
            const movies = await api.getEntries({sort: "title ascending"});
            movieOptions = movies.map((m) => ({value: String(m.id), label: `${m.title} (${m.typ})`}));
        } catch (err) {
            movieOptions = [];
            toastError(err);
        }
        addMovieRow();
    }

    async function save() {
        const name = nameInput.value.trim();
        if (!name) return toast("Name darf nicht leer sein!", "error");

        const movieIds = [...new Set([...rowsBox.children].map((r) => r.select.value).filter(Boolean))];
        try {
            await api.addActor({actorId: selectedActor?.id ?? null, name, movieIds});
            toast("Schauspieler gespeichert");
            modal.close();
            onSaved();
        } catch (err) {
            toastError(err);
        }
    }

    $("#saveActor").addEventListener("click", save);
    $("#toAddActor").addEventListener("click", modal.open);
    $("#addMovieSelect").addEventListener("click", addMovieRow);
}
