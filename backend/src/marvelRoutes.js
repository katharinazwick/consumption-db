//bekomme title, year, universum tragge title und year in marvel title
//suche id und trage id und universum in universum erhöhe positon um 1

app.get("/title-exists", async (req, res) => {
    const { title } = req.query;
    if (!title || !title.trim()) {
        return res.status(400).json({ error: "title query fehlt" });
    }

    try {
        const { rows } = await pool.query(
            "SELECT typ FROM movie WHERE LOWER(TRIM(title)) = LOWER(TRIM($1))",
            [title]
        );

        const count = rows.length;
        const types = rows.map(row => row.typ);

        res.json({ exists: count > 0, count, types });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler bei Titelprüfung" });
    }
});