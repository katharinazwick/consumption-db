import express from "express";
import titleExists from "./titleExists.js";
import addEntry from "./addEntry.js";
import getEntries from "./getEntries.js";
import deleteEntry from "./deleteEntry.js";
import editEntry from "./editEntry.js";
import updateEntry from "./updateEntry.js";
import editFavouriteEntry from "./editFavouriteEntry.js";

const router = express.Router();

router.use(titleExists);
router.use(addEntry);
router.use(getEntries);
router.use(deleteEntry);
router.use(editEntry);
router.use(updateEntry);
router.use(editFavouriteEntry);

export default router;
