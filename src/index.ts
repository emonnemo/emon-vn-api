import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import charactersRouter from "./routes/characters.js";
import conversationsRouter from "./routes/conversations.js";
import configRouter from "./routes/config.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/characters", charactersRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/config", configRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

await connectDB();

app.listen(PORT, () => {
  console.log(`emon-vn-api listening on http://localhost:${PORT}`);
});
