const select = document.getElementById("actor");

// Befüllt das Select mit allen Schauspielern und behält die aktuelle Auswahl bei
export async function loadActorFilter() {
    if (!select) return;

    const current = select.value;

    try {
        const res = await fetch("http://localhost:3000/get-actors");
        if (!res.ok) new Error(`search-actors: HTTP ${res.status}`);
        const actors = await res.json();

        select.innerHTML = "";

        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = "actor";
        select.appendChild(empty);

        actors.forEach((actor) => {
            const opt = document.createElement("option");
            opt.value = actor.id;
            opt.textContent = actor.name;
            select.appendChild(opt);
        });

        // vorherige Auswahl wiederherstellen, falls der Schauspieler noch existiert
        select.value = [...select.options].some((o) => o.value === current) ? current : "";
    } catch (e) {
        console.error(e);
    }
}

loadActorFilter();