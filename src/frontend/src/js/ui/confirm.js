import {el} from "./dom.js";

// Eigener Bestätigungsdialog (Promise<boolean>) statt window.confirm – gleiche Logik, besseres Aussehen.
export function confirmAction(message, {okLabel = "Yes", cancelLabel = "Cancel"} = {}) {
    return new Promise((resolve) => {
        const done = (result) => {
            overlay.remove();
            document.removeEventListener("keydown", onKey, true);
            resolve(result);
        };
        const onKey = (e) => {
            if (e.key === "Escape") { e.stopPropagation(); done(false); }
            if (e.key === "Enter") { e.stopPropagation(); e.preventDefault(); done(true); }
        };
        const ok = el("button", {type: "button", class: "btn btn-primary", textContent: okLabel, on: {click: () => done(true)}});
        const overlay = el("div", {class: "overlay open confirm", on: {mousedown: (e) => e.target === overlay && done(false)}},
            el("div", {class: "dialog dialog-small", role: "alertdialog"},
                el("p", {textContent: message}),
                el("div", {class: "dialog-actions"},
                    el("button", {type: "button", class: "btn", textContent: cancelLabel, on: {click: () => done(false)}}), ok)));
        document.body.append(overlay);
        document.addEventListener("keydown", onKey, true);
        ok.focus();
    });
}
