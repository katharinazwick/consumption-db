import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import routes from "./src/routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routen einbinden
app.use(routes);

// Statische Dateien
console.log(path.join(__dirname, "/frontend/src"))
app.use(express.static(path.join(__dirname, "../frontend/src")));

// Server starten
app.listen(port, () => {
    console.log(`✅ Server läuft auf http://localhost:${port}`);
});

