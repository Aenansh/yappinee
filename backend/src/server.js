import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({ path: "./.env.local" });
const app = express();

const port = process.env.PORT || 5001;

app.use(
  express.json({
    limit: "100kb",
  })
);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

app.listen(port, async () => {
  console.log(`http://localhost:${port}`);
  await connectDB();
  console.log("server is up!");
});
