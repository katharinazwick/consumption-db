// Zentrale Konfiguration: eine Quelle für Backend-URL und alle festen Auswahllisten.
export const API_BASE = "http://localhost:3000";

export const TYPES = ["movie", "serie", "audiobook", "tale"];
export const STREAMS = ["Disney", "Netflix", "Amazon", "Spotify", "Sonstiges"];
export const UNIVERSES = ["Defenders", "Fantastic Four", "MCU", "Spider-Man", "X-Men", "Special"];

export const SORT_OPTIONS = [
    {value: "title ascending", label: "Title A–Z"},
    {value: "title descending", label: "Title Z–A"},
    {value: "viewingyear ascending", label: "Year ↑"},
    {value: "viewingyear descending", label: "Year ↓"},
];

// Filter-Werte des Backends: completed = true/false, favourite = true/false
export const STATUS_OPTIONS = [
    {value: "false", label: "incomplete"},
    {value: "true", label: "complete"},
];
export const FAVOURITE_OPTIONS = [
    {value: "true", label: "favourite"},
    {value: "false", label: "not favourite"},
];
