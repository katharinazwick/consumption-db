import {el} from "./dom.js";

const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * Durchsuchbares Select: Auswahl nur aus der Liste, kein freier Text.
 * options: [{value, label}] · value "" = nichts gewählt (zeigt den Placeholder).
 * Mit clearable steht der Placeholder zusätzlich als erster Eintrag zur Auswahl (für Filter).
 */
export function createSearchSelect({placeholder, options = [], value = "", clearable = false, onChange}) {
    let current = value;
    let items = options;
    let active = 0;
    let visible = [];

    const label = el("span", {class: "ss-label"});
    const trigger = el("button", {type: "button", class: "ss-trigger", on: {click: toggle}}, label, el("span", {class: "ss-caret", textContent: "▾"}));
    const root = el("div", {class: "ss"}, trigger);

    const search = el("input", {type: "text", class: "ss-search", placeholder: "search…", autocomplete: "off"});
    const ul = el("ul", {class: "ss-options", role: "listbox"});
    const list = el("div", {class: "ss-list"}, search, ul);

    function refreshLabel() {
        const hit = items.find((o) => o.value === current);
        label.textContent = hit ? hit.label : placeholder;
        root.classList.toggle("has-value", !!hit);
    }

    function renderOptions() {
        const q = normalize(search.value.trim());
        visible = items.filter((o) => normalize(o.label).includes(q));
        if (clearable && !q) visible = [{value: "", label: placeholder}, ...visible];
        active = Math.max(0, visible.findIndex((o) => o.value === current));
        ul.replaceChildren(...(visible.length
            ? visible.map((o, i) => el("li", {
                class: "ss-option" + (o.value === current ? " selected" : ""),
                role: "option",
                textContent: o.label,
                on: {
                    mousedown: (e) => { e.preventDefault(); choose(o.value); },
                    mousemove: () => { active = i; markActive(false); },
                },
            }))
            : [el("li", {class: "ss-empty", textContent: "no results"})]));
        markActive(true);
    }

    function markActive(scroll) {
        [...ul.children].forEach((li, i) => li.classList.toggle("active", i === active));
        const li = ul.children[active];
        if (!scroll || !li) return;
        // Nur die Liste scrollen – scrollIntoView würde auch die Seite verschieben (und damit die Liste schließen)
        if (li.offsetTop < ul.scrollTop) ul.scrollTop = li.offsetTop;
        else if (li.offsetTop + li.offsetHeight > ul.scrollTop + ul.clientHeight) ul.scrollTop = li.offsetTop + li.offsetHeight - ul.clientHeight;
    }

    function place() {
        const r = trigger.getBoundingClientRect();
        const width = Math.max(r.width, 260);
        const below = window.innerHeight - r.bottom;
        const up = below < 300 && r.top > below;
        Object.assign(list.style, {
            left: Math.min(r.left, window.innerWidth - width - 8) + "px",
            width: width + "px",
            top: up ? "auto" : r.bottom + 4 + "px",
            bottom: up ? window.innerHeight - r.top + 4 + "px" : "auto",
        });
    }

    const outside = (e) => { if (!root.contains(e.target) && !list.contains(e.target)) close(); };
    const onScroll = (e) => { if (!list.contains(e.target)) place(); }; // Liste folgt dem Button

    function open() {
        document.body.append(list);
        search.value = "";
        list.classList.add("open");
        place();
        renderOptions();
        search.focus({preventScroll: true});
        document.addEventListener("mousedown", outside);
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", close);
    }

    function close(refocus = false) {
        if (!list.classList.contains("open")) return;
        list.classList.remove("open");
        list.remove();
        document.removeEventListener("mousedown", outside);
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", close);
        if (refocus === true) trigger.focus();
    }

    function toggle() {
        list.classList.contains("open") ? close(true) : open();
    }

    function choose(v) {
        const changed = v !== current;
        current = v;
        refreshLabel();
        close(true);
        if (changed) onChange?.(current);
    }

    search.addEventListener("input", renderOptions);
    search.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (visible.length) active = (active + (e.key === "ArrowDown" ? 1 : visible.length - 1)) % visible.length;
            markActive(true);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (visible[active]) choose(visible[active].value);
        } else if (e.key === "Escape") {
            close(true);
        } else return;
        e.stopPropagation(); // der umgebende Dialog soll Esc/Enter/Pfeile nicht auch noch verarbeiten
    });

    refreshLabel();

    return {
        el: root,
        get value() { return current; },
        set value(v) { current = v; refreshLabel(); },
        setOptions(next) {
            items = next;
            if (!items.some((o) => o.value === current)) current = "";
            refreshLabel();
        },
        focus: () => trigger.focus(),
    };
}
