import express from "express";
import getActors from "./getActors.js";
import addActor from "./addActor.js";
import getActorMovies from "./getActorMovies.js";
import updateActor from "./updateActor.js";
import removeActorMovie from "./removeActorMovie.js";

const router = express.Router();

router.use(getActors);
router.use(addActor);
router.use(getActorMovies);
router.use(updateActor);
router.use(removeActorMovie);

export default router;
