import express from "express";
import getMarvelEntries from "./getMarvelEntries.js";
import addMarvelEntry from "./addMarvelEntry.js";
import updateMarvelEntry from "./updateMarvelEntry.js";
import deleteMarvelEntry from "./deleteMarvelEntry.js";

const router = express.Router();

router.use(getMarvelEntries);
router.use(addMarvelEntry);
router.use(updateMarvelEntry);
router.use(deleteMarvelEntry);

export default router;
