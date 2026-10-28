import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

// Löscht nur die Zuordnung Schauspieler ↔ Film, nicht den Film selbst.
router.delete("/remove-actor-movie/:actorId/:movieId", async (req, res) => {
    const {actorId, movieId} = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM movie_actor WHERE actorid = $1 AND movieid = $2",
            [actorId, movieId]
        );
        if (result.rowCount === 0) return res.status(404).json({error: "Zuordnung nicht gefunden"});
        res.json({message: "Film beim Schauspieler entfernt"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Löschen"});
    }
});

export default router;
