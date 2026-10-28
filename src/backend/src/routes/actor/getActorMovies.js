import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

// Alle Schauspieler (alphabetisch) mit ihren Filmen – auch Schauspieler ohne Filme.
router.get("/get-actor-movies", async (req, res) => {
    try {
        const {rows} = await pool.query(
            `SELECT a.id AS actorid, a.name, m.id AS movieid, m.title, m.typ
             FROM actor a
                      LEFT JOIN movie_actor ma ON ma.actorid = a.id
                      LEFT JOIN movie m ON m.id = ma.movieid
             ORDER BY LOWER(a.name), a.id, LOWER(m.title)`
        );

        const actors = new Map();
        for (const r of rows) {
            if (!actors.has(r.actorid)) actors.set(r.actorid, {id: r.actorid, name: r.name, movies: []});
            if (r.movieid) actors.get(r.actorid).movies.push({id: r.movieid, title: r.title, typ: r.typ});
        }
        res.json([...actors.values()]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Abrufen der Schauspieler!"});
    }
});

export default router;
