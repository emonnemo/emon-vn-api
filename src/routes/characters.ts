import { Router } from "express";
import { Character } from "../models/Character.js";

const router = Router();

router.get("/", async (_req, res) => {
  const characters = await Character.find().sort({ updatedAt: -1 }).lean();
  res.json(characters);
});

router.get("/:id", async (req, res) => {
  const character = await Character.findById(req.params.id).lean();
  if (!character) {
    res.status(404).json({ error: "Character not found" });
    return;
  }
  res.json(character);
});

router.post("/", async (req, res) => {
  const { name, appearance, personality, spriteUrl, fullBodyUrl } = req.body;
  if (!name?.trim()) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  const now = Date.now();
  const character = await Character.create({
    name,
    appearance,
    personality,
    spriteUrl: spriteUrl ?? null,
    fullBodyUrl: fullBodyUrl ?? null,
    createdAt: now,
    updatedAt: now,
  });
  res.status(201).json(character);
});

router.put("/:id", async (req, res) => {
  const { name, appearance, personality, spriteUrl, fullBodyUrl } = req.body;
  const update: Record<string, unknown> = { updatedAt: Date.now() };
  if (name !== undefined) update.name = name;
  if (appearance !== undefined) update.appearance = appearance;
  if (personality !== undefined) update.personality = personality;
  if (spriteUrl !== undefined) update.spriteUrl = spriteUrl;
  if (fullBodyUrl !== undefined) update.fullBodyUrl = fullBodyUrl;

  const character = await Character.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
  if (!character) {
    res.status(404).json({ error: "Character not found" });
    return;
  }
  res.json(character);
});

router.delete("/:id", async (req, res) => {
  const character = await Character.findByIdAndDelete(req.params.id);
  if (!character) {
    res.status(404).json({ error: "Character not found" });
    return;
  }
  res.json({ success: true });
});

export default router;
