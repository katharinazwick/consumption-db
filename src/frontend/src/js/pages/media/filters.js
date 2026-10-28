import {el} from "../../ui/dom.js";
import {createSearchSelect} from "../../ui/searchSelect.js";
import {createPopover} from "../../ui/popover.js";
import {FAVOURITE_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS, STREAMS, TYPES} from "../../config.js";

const asOptions = (list) => list.map((value) => ({value, label: value}));

// Reihenfolge = Reihenfolge im Popup. `param` ist der Query-Parameter des Backends.
const DEFINITIONS = [
    {key: "stream", param: "streamFilter", label: "Stream", options: asOptions(STREAMS)},
    {key: "typ", param: "typFilter", label: "Type", options: asOptions(TYPES)},
    {key: "status", param: "incompleteFilter", label: "Status", options: STATUS_OPTIONS},
    {key: "favourite", param: "favouriteFilter", label: "Relationship", options: FAVOURITE_OPTIONS},
];

/** Baut Filter-Popup, Chips und Sortierung. Ruft onChange, sobald sich ein Wert ändert. */
export function initFilters({onChange}) {
    const panel = document.getElementById("filterPanel");
    const toggle = document.getElementById("filterToggle");
    const badge = document.getElementById("filterCount");
    const chips = document.getElementById("activeFilters");
    const sortSelect = document.getElementById("sort");

    const changed = () => { renderChips(); onChange(); };

    // Jeder Filter bekommt ein Control mit einheitlichem Zugriff: get() / set(v) / labelOf(v)
    const controls = Object.fromEntries(DEFINITIONS.map((def) => {
        let control;
        if (def.search) {
            const ss = createSearchSelect({placeholder: "all", clearable: true, onChange: changed});
            control = {node: ss.el, get: () => ss.value, set: (v) => (ss.value = v), setOptions: ss.setOptions};
        } else {
            const select = el("select", {on: {change: changed}},
                el("option", {value: "", textContent: "all"}),
                ...def.options.map((o) => el("option", {value: o.value, textContent: o.label})));
            control = {node: select, get: () => select.value, set: (v) => (select.value = v)};
        }
        return [def.key, {...def, ...control}];
    }));

    sortSelect.replaceChildren(...SORT_OPTIONS.map((o) => el("option", {value: o.value, textContent: o.label})));
    sortSelect.addEventListener("change", onChange);

    const resetButton = el("button", {type: "button", class: "btn btn-ghost", textContent: "Reset filters", on: {click: reset}});
    panel.replaceChildren(
        ...DEFINITIONS.map((d) => el("label", {class: "field"}, el("span", {textContent: d.label}), controls[d.key].node)),
        el("div", {class: "popover-footer"}, resetButton),
    );
    createPopover(toggle, panel);

    function labelOf(def, value) {
        return def.options.find((o) => o.value === value)?.label ?? value;
    }

    const activeFilters = () => DEFINITIONS.filter((d) => controls[d.key].get() !== "");

    function renderChips() {
        const active = activeFilters();
        badge.hidden = active.length === 0;
        badge.textContent = active.length;
        resetButton.disabled = active.length === 0;
        chips.replaceChildren(...active.map((d) => el("button", {
            type: "button", class: "chip", title: "Remove filter",
            on: {click: () => { controls[d.key].set(""); changed(); }},
        }, `${d.label}: ${labelOf(controls[d.key], controls[d.key].get())}`, el("span", {class: "chip-x", textContent: "×"}))));
    }

    function reset() {
        DEFINITIONS.forEach((d) => controls[d.key].set(""));
        changed();
    }

    renderChips();

    return {
        // Parameter exakt so wie das Backend sie erwartet (leere Filter als "")
        getParams: () => ({
            ...Object.fromEntries(DEFINITIONS.map((d) => [d.param, controls[d.key].get()])),
            sort: sortSelect.value,
        }),
    };
}
