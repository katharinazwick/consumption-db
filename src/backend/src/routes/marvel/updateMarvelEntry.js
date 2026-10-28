import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

router.put("/update-marvelEntry/:id", async (req, res) => {
    const { id } = req.params;
    const { title, date, position, universum } = req.body;

    // Das Frontend sendet nur die geänderten Felder: fehlendes Feld = unverändert lassen
    const sets = [];
    const values = [];

    if (title !== undefined) {
        if (!String(title).trim()) return res.status(400).json({ error: "Title darf nicht leer sein!" });
        values.push(String(title).trim());
        sets.push(`title = $${values.length}`);
    }
    if (date !== undefined) {
        values.push(date === "" || date === null ? null : date); // leer = Datum bewusst löschen
        sets.push(`date = $${values.length}`);
    }

    // Die Position gehört zu einem Universum (Tabelle marvel_universum), nicht zum Titel
    let newPosition;
    if (position !== undefined) {
        newPosition = Number(position);
        if (String(position).trim() === "" || !Number.isInteger(newPosition)) {
            return res.status(400).json({ error: "Position muss eine ganze Zahl sein!" });
        }
        if (!universum) return res.status(400).json({ error: "Universum fehlt für die Position!" });
    }

    if (sets.length === 0 && newPosition === undefined) {
        return res.json({ success: true, message: "Keine Änderungen." });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        if (sets.length > 0) {
            await client.query(
                `UPDATE marvel_title SET ${sets.join(", ")} WHERE id = $${values.length + 1}`,
                [...values, id]
            );
        }
        if (newPosition !== undefined) {
            const r = await client.query(
                `UPDATE marvel_universum SET position = $1 WHERE marvel_titleid = $2 AND universum = $3`,
                [newPosition, id, universum]
            );
            if (r.rowCount === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({ error: "Eintrag im Universum nicht gefunden" });
            }
        }

        await client.query("COMMIT");
        res.json({ success: true, message: "Eintrag aktualisiert." });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Fehler beim Update:", error);
        res.status(500).json({ error: "Fehler beim Update" });
    } finally {
        client.release();
    }
});

export default router;