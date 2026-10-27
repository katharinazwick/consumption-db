import express from "express";
import getActors from "./getActors.js";
import addActor from "./addActor.js";

const router = express.Router();

router.use(getActors);
router.use(addActor);

export default router;
