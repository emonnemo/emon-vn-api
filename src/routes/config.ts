import { Router } from "express";
import { Config } from "../models/Config.js";

const router = Router();

router.get("/", async (_req, res) => {
  const configs = await Config.find().lean();
  const map: Record<string, unknown> = {};
  for (const c of configs) {
    map[c.key] = c.value;
  }
  res.json(map);
});

router.get("/:key", async (req, res) => {
  const config = await Config.findOne({ key: req.params.key }).lean();
  if (!config) {
    res.status(404).json({ error: "Config key not found" });
    return;
  }
  res.json({ key: config.key, value: config.value });
});

router.put("/", async (req, res) => {
  const entries = Object.entries(req.body);
  const bulk = entries.map(([key, value]) => ({
    updateOne: {
      filter: { key },
      update: { $set: { value } },
      upsert: true,
    },
  }));
  if (bulk.length > 0) {
    await Config.bulkWrite(bulk);
  }
  const configs = await Config.find().lean();
  const map: Record<string, unknown> = {};
  for (const c of configs) {
    map[c.key] = c.value;
  }
  res.json(map);
});

router.put("/:key", async (req, res) => {
  const { value } = req.body;
  const config = await Config.findOneAndUpdate(
    { key: req.params.key },
    { value },
    { upsert: true, new: true },
  ).lean();
  res.json({ key: config.key, value: config.value });
});

export default router;
