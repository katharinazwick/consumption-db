// Overlay-Dialoge: öffnen/schließen, Esc und Klick auf den Hintergrund schließen,
// Enter speichert (außer in Textarea oder bei offener Suchliste), Pfeil hoch/runter wechselt das Feld.
const FIELDS = "input:not([type=hidden]), textarea, select, .ss-trigger";

export function createModal(overlay, {onOpen, onClose, onSubmit} = {}) {
    const isOpen = () => overlay.classList.contains("open");

    function open() {
        overlay.classList.add("open");
        onOpen?.();
        setTimeout(() => overlay.querySelector(FIELDS)?.focus(), 30);
    }

    function close() {
        overlay.classList.remove("open");
        onClose?.();
    }

    overlay.addEventListener("mousedown", (e) => {
        if (e.target === overlay) close();
    });
    overlay.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", close));

    document.addEventListener("keydown", (e) => {
        if (!isOpen() || document.querySelector(".ss-list.open")) return; // Suchliste behandelt Tasten selbst
        const target = e.target;
        if (e.key === "Escape") return close();
        if (e.key === "Enter" && onSubmit && target.tagName !== "TEXTAREA" && target.tagName !== "BUTTON") {
            e.preventDefault();
            onSubmit();
        }
        if ((e.key === "ArrowDown" || e.key === "ArrowUp") && target.type !== "number") {
            const fields = [...overlay.querySelectorAll(FIELDS)];
            const i = fields.indexOf(target);
            if (i === -1) return;
            e.preventDefault();
            fields[(i + (e.key === "ArrowDown" ? 1 : fields.length - 1)) % fields.length].focus();
        }
    });

    return {open, close, isOpen};
}
