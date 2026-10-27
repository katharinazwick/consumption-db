import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

// Schauspieler anlegen ODER bei vorhandenem nur Filme ergänzen
router.post("/add-actor", async (req, res) => {
    const {actorId, name, movieIds} = req.body;
    const cleanName = (name || "").trim();
    if (!actorId && !cleanName) return res.status(400).json({error: "Name darf nicht leer sein!"});

    const ids = Array.isArray(movieIds) ? [...new Set(movieIds)] : [];

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        let actor;
        let created = false;

        if (actorId) {
            // vorhandenen Schauspieler per ID verwenden
            const {rows} = await client.query("SELECT * FROM actor WHERE id = $1", [actorId]);
            if (rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({error: "Schauspieler nicht gefunden"});
            }
            actor = rows[0];
        } else {
            // kein Vorschlag angeklickt: trotzdem prüfen, ob der Name schon existiert
            const {rows} = await client.query(
                "SELECT * FROM actor WHERE LOWER(TRIM(name)) = LOWER($1)",
                [cleanName]
            );
            if (rows.length > 0) {
                actor = rows[0];
            } else {
                const inserted = await client.query(
                    "INSERT INTO actor (name) VALUES ($1) RETURNING *",
                    [cleanName]
                );
                actor = inserted.rows[0];
                created = true;
            }
        }

        // nur Filme eintragen, die noch nicht verknüpft sind
        if (ids.length > 0) {
            await client.query(
                `INSERT INTO movie_actor (actorid, movieid)
                 SELECT $1::uuid, m
                 FROM UNNEST($2::uuid[]) AS m
                 WHERE NOT EXISTS (SELECT 1
                                   FROM movie_actor
                                   WHERE actorid = $1::uuid
                                     AND movieid = m)`,
                [actor.id, ids]
            );
        }

        await client.query("COMMIT");
        res.json({...actor, created, movieIds: ids});
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({error: "Fehler beim Speichern des Schauspielers!"});
    } finally {
        client.release();
    }
});

export default router;
