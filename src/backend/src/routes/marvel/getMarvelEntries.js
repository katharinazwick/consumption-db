import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

router.get("/get-marvelEntries", async (req, res) => {
    try {
        const { universum } = req.query;
        let query = `
            SELECT t.id, t.title, t.date, u.universum, u.position
            FROM marvel_title t
            JOIN marvel_universum u
            ON t.id = u.marvel_titleid
        `;
        const params = [];
        if (universum) {
            query += " WHERE u.universum = $1";
            params.push(universum);
        }
        query += " ORDER BY u.universum, u.position;";
        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error("Fehler beim Abrufen der Marvel-Einträge:", err);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

export default router;
