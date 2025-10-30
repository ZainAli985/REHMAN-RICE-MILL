import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from "../routes/router.js";
import connectDB from "../../config/MONGODB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();
// API routes
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});