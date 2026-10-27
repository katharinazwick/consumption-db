router.get("/get-entries", async (req, res) => {
    const {incompleteFilter, favouriteFilter, typFilter, streamFilter, actorFilter, sort} = req.query;
    const filterArray = [];
    const filterValueArray = [];

    try {
        let sqlStatement = "SELECT * FROM movie";
        const arrayDynamic = {
            completed: incompleteFilter,
            favourite: favouriteFilter,
            typ: typFilter,
            stream: streamFilter
        };

        for (let key in arrayDynamic) {
            if (arrayDynamic[key]) {
                filterArray.push(`${key} = $${filterArray.length + 1}`);
                filterValueArray.push(arrayDynamic[key]);
            }
        }

        // Schauspieler-Filter: nur Filme, die mit diesem Schauspieler verknüpft sind
        if (actorFilter) {
            filterArray.push(
                `id IN (SELECT movieid FROM movie_actor WHERE actorid = $${filterArray.length + 1})`
            );
            filterValueArray.push(actorFilter);
        }

        if (filterArray.length > 0) sqlStatement += " WHERE " + filterArray.join(" AND ");

        if (sort) {
            const sortPart = sort.split(" ");
            sqlStatement += ` ORDER BY ${sortPart[0]} ${sortPart[1] === "ascending" ? "ASC" : "DESC"}`;
        }

        const result = await pool.query(sqlStatement, filterValueArray);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Fehler beim Abrufen der Daten!"});
    }
});