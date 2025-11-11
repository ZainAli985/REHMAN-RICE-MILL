import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import router from "../routes/router.js";
import connectDB from "../config/MONGODB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Handle __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve the built React frontend
const distPath = path.resolve(__dirname, "../../dist");
app.use(express.static(distPath));
app.use(express.json());

// ✅ Serve index.html directly from / (no wildcard)
app.get("/", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ API & Database setup remain untouched
connectDB();
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});
