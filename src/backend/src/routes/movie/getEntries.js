import express from "express";
import {pool} from "../../pool.js";

const router = express.Router();

router.get("/get-entries", async (req, res) => {
    const {incompleteFilter, favouriteFilter, typFilter, streamFilter, sort} = req.query;
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

export default router;
