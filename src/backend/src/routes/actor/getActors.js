import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

router.get("/get-actors", async (req, res) => {
    const q = (req.query.q || "").trim();

    try {
        if (!q) {
            const {rows} = await pool.query("SELECT id, name FROM actor ORDER BY name");
            return res.json(rows);
        }

        // LIKE-Sonderzeichen escapen
        const escaped = q.replace(/[\\%_]/g, "\\$&");

        const {rows} = await pool.query(
            `SELECT id, name
             FROM actor
             WHERE name ILIKE $1
             ORDER BY (name ILIKE $2) DESC, name
                 LIMIT 5`,
            [`%${escaped}%`, `${escaped}%`]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler bei der Schauspieler-Suche"});
    }
});

export default router;
