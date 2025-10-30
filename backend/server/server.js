import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from "../routes/router.js";
import connectDB from "../config/MONGODB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [process.env.FRONTEND_URL || "*"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // server-to-server / Postman
    if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("CORS not allowed"));
  }
}));

app.use(express.json());

// Connect to MongoDB
connectDB();
// API routes
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});