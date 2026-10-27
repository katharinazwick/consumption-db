import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

router.get("/title-exists", async (req, res) => {
    const {title} = req.query;
    if (!title || !title.trim()) return res.status(400).json({error: "title query fehlt"});

    try {
        const {rows} = await pool.query(
            "SELECT typ FROM movie WHERE LOWER(TRIM(title)) = LOWER(TRIM($1))",
            [title]
        );
        res.json({exists: rows.length > 0, count: rows.length, types: rows.map(r => r.typ)});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler bei Titelprüfung"});
    }
});

export default router;
