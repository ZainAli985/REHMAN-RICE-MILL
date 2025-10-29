import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "../routes/router.js";
import connectDB from "../../config/MONGODB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve("../.env") });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", router);

connectDB();

// ✅ Serve Vite build in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../../dist");
  app.use(express.static(distPath));

  // ✅ Fix: use "(.*)" instead of "*"
  app.get("(.*)", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
