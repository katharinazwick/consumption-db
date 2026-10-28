import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

router.get("/get-available-movies", async (req, res) => {
    const {actorId} = req.query;

    try {
        const result = actorId
            ? await pool.query(
                `SELECT m.id, m.title, m.typ
                 FROM movie m
                 WHERE NOT EXISTS (
                     SELECT 1 FROM movie_actor ma
                     WHERE ma.movieid = m.id AND ma.actorid = $1
                 )
                 ORDER BY m.title ASC`,
                [actorId])
            : await pool.query("SELECT id, title, typ FROM movie ORDER BY title ASC");

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Abrufen der Filme!"});
    }
});

export default router;