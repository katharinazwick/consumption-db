export function setupActorSuggestions({input, list, onPick, onType}) {
    let timer;

    const hide = () => {
        list.innerHTML = "";
        list.style.display = "none";
    };

    const render = (actors) => {
        list.innerHTML = "";
        if (actors.length === 0) return hide();

        actors.forEach((actor) => {
            const item = document.createElement("div");
            item.className = "suggestionItem";
            item.textContent = actor.name;
            // mousedown statt click, sonst feuert vorher das blur-Event und die Liste ist weg
            item.addEventListener("mousedown", (e) => {
                e.preventDefault();
                input.value = actor.name;
                onPick(actor);
                hide();
            });
            list.appendChild(item);
        });
        list.style.display = "block";
    };

    input.addEventListener("input", () => {
        onType(); // Nutzer tippt wieder -> bisherige Auswahl verwerfen
        clearTimeout(timer);

        const q = input.value.trim();
        if (!q) return hide();

        // Debounce: erst 200ms nach der letzten Eingabe anfragen
        timer = setTimeout(async () => {
            try {
                const res = await fetch(`http://localhost:3000/get-actors?q=${encodeURIComponent(q)}`);
                const actors = await res.json();
                if (input.value.trim() !== q) return; // veraltete Antwort ignorieren
                render(actors);
            } catch (e) {
                console.error(e);
                hide();
            }
        }, 200);
    });

    input.addEventListener("blur", () => setTimeout(hide, 150));

    return hide;
}