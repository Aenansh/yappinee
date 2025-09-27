import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import {connectDB} from "./lib/db.js"

dotenv.config({ path: "./.env.local" });
const app = express();

const port = process.env.PORT || 5001;

app.use(
  express.json({
    limit: "100kb",
  })
);

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
  connectDB();
  console.log("server is up!");
});
