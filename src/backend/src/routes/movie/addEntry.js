import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

router.post("/add-entry", async (req, res) => {
    const {title, viewingYear, stream, typ, description, completed, favourite} = req.body;
    if (!title) return res.status(400).json({error: "Title darf nicht leer sein!"});

    try {
        const result = await pool.query(
            "INSERT INTO movie (title, viewingYear, stream, typ, description, completed, favourite) VALUES ($1,$2,$3,$4,$5,$6,$7 ) RETURNING *",
            [title, viewingYear, stream, typ, description, completed, favourite]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Speichern!"});
    }
});

export default router;
