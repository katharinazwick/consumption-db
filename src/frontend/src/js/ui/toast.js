import {el} from "./dom.js";

let host;

// Nicht-blockierende Rückmeldung statt alert().
export function toast(message, kind = "ok") {
    host ??= document.body.appendChild(el("div", {class: "toasts", role: "status"}));
    const node = el("div", {class: `toast toast-${kind}`, textContent: message});
    host.append(node);
    setTimeout(() => node.remove(), kind === "error" ? 5000 : 2500);
}

export const toastError = (err) => toast(err.message || String(err), "error");
