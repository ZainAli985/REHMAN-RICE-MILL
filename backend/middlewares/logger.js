import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the main server.log (two levels up)
const logFilePath = path.resolve(__dirname, "../server.log");

// Ensure log file exists
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, "");
}

// Logger middleware
const logger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logEntry = `[${new Date().toLocaleString()}] ${req.method} ${
      req.originalUrl
    } → ${res.statusCode} (${duration}ms)\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) console.error("Failed to write to log file:", err);
    });
  });

  next();
};

export default logger;
