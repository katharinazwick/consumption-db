import express from "express";
import movieRoutes from "./movie/index.js";
import actorRoutes from "./actor/index.js";
import marvelRoutes from "./marvel/index.js";

const router = express.Router();

router.use(movieRoutes);
router.use(actorRoutes);
router.use(marvelRoutes);

export default router;
