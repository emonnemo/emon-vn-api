import mongoose, { Schema, type Document } from "mongoose";

export interface IMessage {
  role: "user" | "character" | "system";
  content: string;
  suggestions?: string[];
  emotion?: string;
  pose?: string;
  outfit?: string;
  location?: string;
  camera?: string;
  audioUrl?: string;
}

export interface IGeneratedImageEntry {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface IRelationshipSummary {
  relationship_level: number;
  trust: number;
  current_mood: string;
  current_outfit: string;
  important_memories: string[];
}

export interface IConversation extends Document {
  characterName: string;
  characterSpriteUrl: string | null;
  characterFullBodyUrl: string | null;
  personality: string;
  appearance: string;
  messages: IMessage[];
  generatedImages: IGeneratedImageEntry[];
  relationshipSummary: IRelationshipSummary;
  createdAt: number;
  updatedAt: number;
}

const messageSchema = new Schema<IMessage>(
  {
    role: { type: String, enum: ["user", "character", "system"], required: true },
    content: { type: String, required: true },
    suggestions: { type: [String], default: undefined },
    emotion: { type: String, default: undefined },
    pose: { type: String, default: undefined },
    outfit: { type: String, default: undefined },
    location: { type: String, default: undefined },
    camera: { type: String, default: undefined },
    audioUrl: { type: String, default: undefined },
  },
  { _id: false },
);

const generatedImageSchema = new Schema<IGeneratedImageEntry>(
  {
    url: { type: String, required: true },
    prompt: { type: String, required: true },
    timestamp: { type: Number, required: true },
  },
  { _id: false },
);

const conversationSchema = new Schema<IConversation>(
  {
    characterName: { type: String, required: true },
    characterSpriteUrl: { type: String, default: null },
    characterFullBodyUrl: { type: String, default: null },
    personality: { type: String, default: "" },
    appearance: { type: String, default: "" },
    messages: { type: [messageSchema], default: [] },
    generatedImages: { type: [generatedImageSchema], default: [] },
    relationshipSummary: {
      relationship_level: { type: Number, default: 0 },
      trust: { type: Number, default: 0 },
      current_mood: { type: String, default: "neutral" },
      current_outfit: { type: String, default: "casual" },
      important_memories: { type: [String], default: [] },
    },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
  },
  { timestamps: false, toJSON: { transform: (_doc: unknown, ret: Record<string, unknown>) => { ret.id = String(ret._id); delete ret._id; delete ret.__v; } } },
);

export const Conversation = mongoose.model<IConversation>("Conversation", conversationSchema);
