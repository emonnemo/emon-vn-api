import { Router } from "express";
import { Conversation } from "../models/Conversation.js";

const router = Router();

router.get("/", async (req, res) => {
  const { characterName } = req.query;
  const filter: Record<string, unknown> = {};
  if (characterName) filter.characterName = characterName;
  const conversations = await Conversation.find(filter).sort({ updatedAt: -1 }).lean();
  res.json(conversations);
});

router.get("/:id", async (req, res) => {
  const conversation = await Conversation.findById(req.params.id).lean();
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  res.json(conversation);
});

router.post("/", async (req, res) => {
  const { characterName, characterSpriteUrl, characterFullBodyUrl, personality, appearance, messages, generatedImages, relationshipSummary } = req.body;
  if (!characterName?.trim()) {
    res.status(400).json({ error: "characterName is required" });
    return;
  }
  const now = Date.now();
  const conversation = await Conversation.create({
    characterName,
    characterSpriteUrl: characterSpriteUrl ?? null,
    characterFullBodyUrl: characterFullBodyUrl ?? null,
    personality: personality ?? "",
    appearance: appearance ?? "",
    messages: messages ?? [],
    generatedImages: generatedImages ?? [],
    relationshipSummary: relationshipSummary ?? { relationship_level: 0, trust: 0, current_mood: "neutral", current_outfit: "casual", important_memories: [] },
    createdAt: now,
    updatedAt: now,
  });
  res.status(201).json(conversation);
});

router.put("/:id", async (req, res) => {
  const { messages, generatedImages, relationshipSummary, personality } = req.body;
  const update: Record<string, unknown> = { updatedAt: Date.now() };
  if (messages !== undefined) update.messages = messages;
  if (generatedImages !== undefined) update.generatedImages = generatedImages;
  if (relationshipSummary !== undefined) update.relationshipSummary = relationshipSummary;
  if (personality !== undefined) update.personality = personality;

  const conversation = await Conversation.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  res.json(conversation);
});

router.delete("/:id", async (req, res) => {
  const conversation = await Conversation.findByIdAndDelete(req.params.id);
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  res.json({ success: true });
});

export default router;
