// Kleine Helfer, damit nicht überall createElement/appendChild-Ketten stehen.
export function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    const {class: cls, dataset, on, ...rest} = props;
    if (cls) node.className = cls;
    if (dataset) Object.assign(node.dataset, dataset);
    if (on) for (const [evt, fn] of Object.entries(on)) node.addEventListener(evt, fn);
    Object.assign(node, rest);
    node.append(...children.flat().filter((c) => c != null && c !== false));
    return node;
}

export const $ = (selector, root = document) => root.querySelector(selector);

// Befüllt ein <select> aus einer Liste aus Strings oder {value,label}.
export function fillSelect(select, items, placeholder) {
    select.replaceChildren();
    if (placeholder !== undefined) select.append(el("option", {value: "", textContent: placeholder}));
    for (const item of items) {
        const {value, label} = typeof item === "string" ? {value: item, label: item} : item;
        select.append(el("option", {value, textContent: label}));
    }
}
