import {API_BASE} from "./config.js";

export class ApiError extends Error {}

// Einziger Ort mit fetch: übersetzt Netzwerk- und HTTP-Fehler in eine lesbare ApiError.
async function request(path, {method = "GET", body, query} = {}) {
    const qs = query ? "?" + new URLSearchParams(query) : "";
    let res;
    try {
        res = await fetch(API_BASE + path + qs, {
            method,
            headers: body ? {"Content-Type": "application/json"} : undefined,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new ApiError("Server nicht erreichbar");
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(data.error || res.statusText);
    return data;
}

// ---- Media ----
export const getEntries = (filters) => request("/get-entries", {query: filters});
export const titleExists = (title) => request("/title-exists", {query: {title}});
export const addEntry = (entry) => request("/add-entry", {method: "POST", body: entry});
export const updateEntry = (id, changes) => request(`/update-entry/${id}`, {method: "PUT", body: changes});
export const setCompleted = (id, completed) => request(`/edit-entry/${id}`, {method: "PUT", body: {completed}});
export const toggleFavourite = (id) => request(`/editFavourite-entry/${id}`, {method: "PUT"});
export const deleteEntry = (id) => request(`/delete-entry/${id}`, {method: "DELETE"});

// ---- Actors ----
export const getActors = (q) => request("/get-actors", {query: q ? {q} : undefined});
export const getAvailableMovies = (actorId) =>
    request("/get-available-movies", {query: actorId ? {actorId} : undefined});
export const addActor = (payload) => request("/add-actor", {method: "POST", body: payload});

// ---- Marvel ----
export const getMarvelEntries = (universum) =>
    request("/get-marvelEntries", {query: universum ? {universum} : undefined});
export const addMarvelEntry = (entry) => request("/add-marvelEntry", {method: "POST", body: entry});
export const updateMarvelEntry = (id, changes) => request(`/update-marvelEntry/${id}`, {method: "PUT", body: changes});
export const deleteMarvelEntry = (id) => request(`/delete-marvelEntry/${id}`, {method: "DELETE"});

// ---- Actor-Übersicht ----
export const getActorMovies = () => request("/get-actor-movies");
export const updateActor = (id, changes) => request(`/update-actor/${id}`, {method: "PUT", body: changes});
export const removeActorMovie = (actorId, movieId) => request(`/remove-actor-movie/${actorId}/${movieId}`, {method: "DELETE"});
