// Aufklapp-Panel an einem Button (z. B. Filter). Schließt bei Klick daneben und mit Esc.
export function createPopover(button, panel) {
    const setOpen = (open) => {
        panel.classList.toggle("open", open);
        button.setAttribute("aria-expanded", String(open));
    };

    button.addEventListener("click", () => setOpen(!panel.classList.contains("open")));
    document.addEventListener("mousedown", (e) => {
        // Die Suchliste der Selects hängt am <body>, ein Klick darin zählt als "innen"
        if (!panel.contains(e.target) && !button.contains(e.target) && !e.target.closest(".ss-list")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && panel.classList.contains("open") && !document.querySelector(".ss-list.open")) {
            setOpen(false);
            button.focus();
        }
    });

    return {open: () => setOpen(true), close: () => setOpen(false)};
}
