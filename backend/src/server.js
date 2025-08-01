import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ Import CORS

import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();

// ✅ Start cron job only in production
if (process.env.NODE_ENV === "production") job.start();

// ✅ Enable all CORS
app.use(cors());

// Middlewares
app.use(rateLimiter);
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api/transactions", transactionsRoute);

const PORT = process.env.PORT || 5001;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});
