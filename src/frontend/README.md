# Media database – Frontend

```
src/
├── index.html / marvel.html        Seiten (nur Markup)
├── assets/marvel.jpg
├── css/
│   ├── main.css                    bindet alles ein
│   ├── tokens.css                  Farben, Maße, Reset
│   ├── layout.css                  Header, Toolbar
│   ├── controls.css                Buttons, Inputs, Selects
│   ├── table.css                   Raster, Zeilen, Abschnitte
│   ├── dialogs.css                 Dialoge, Actor-Popup
│   ├── components.css              Filter-Popover, Chips, Such-Select, Toasts
│   └── marvel.css                  Marvel-Theme
└── js/
    ├── config.js                   Backend-URL + feste Listen (Typen, Streams, Universen)
    ├── api.js                      alle Backend-Aufrufe an einem Ort
    ├── ui/                         wiederverwendbar: dom, toast, confirm, modal, popover,
    │                               searchSelect (durchsuchbares Select), rowKit (Icons, Inline-Edit)
    └── pages/
        ├── media/                  main, filters, table, addPopup, actorPopup, actorSuggest
        └── marvel/                 main, table, popup
```
backend mit npm run start 