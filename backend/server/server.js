import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import router from "../routes/router.js"; 
import connectDB from "../../config/MONGODB.js";

dotenv.config({ path: path.resolve("../.env") }); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", router); 

connectDB();

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const distPath = path.join(__dirname, "../dist"); // adjust if needed

  app.use(express.static(distPath));

  // Catch-all route for SPA
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running. Frontend served via Vite dev server.");
  });
}

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
