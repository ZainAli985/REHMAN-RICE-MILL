import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import router from "../routes/router.js";
import connectDB from "../config/MONGODB.js";
import logger from "../middlewares/logger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(logger);

// ✅ Serve the built React frontend
const distPath = path.resolve(__dirname, "../../dist");
app.use(express.static(distPath));

// ✅ Serve index.html directly from / (no wildcard)
app.get("/", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ API & Database setup remain untouched
connectDB();
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`✅ Server running on ${PORT}`);
});
