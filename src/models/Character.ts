import mongoose, { Schema, type Document } from "mongoose";

export interface ICharacterAppearance {
  gender: string;
  age: string;
  hair: { color: string; style: string };
  eyes: { color: string };
  body: { height: string; type: string };
  skinTone: string;
  outfit: string;
  accessories: string;
  specialFeatures: string;
}

export interface ICharacterPersonality {
  traits: string[];
  notes: string;
}

export interface ICharacter extends Document {
  name: string;
  appearance: ICharacterAppearance;
  personality: ICharacterPersonality;
  spriteUrl: string | null;
  fullBodyUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

const characterSchema = new Schema<ICharacter>(
  {
    name: { type: String, required: true },
    appearance: {
      gender: { type: String, default: "" },
      age: { type: String, default: "" },
      hair: {
        color: { type: String, default: "" },
        style: { type: String, default: "" },
      },
      eyes: {
        color: { type: String, default: "" },
      },
      body: {
        height: { type: String, default: "" },
        type: { type: String, default: "" },
      },
      skinTone: { type: String, default: "" },
      outfit: { type: String, default: "" },
      accessories: { type: String, default: "" },
      specialFeatures: { type: String, default: "" },
    },
    personality: {
      traits: { type: [String], default: [] },
      notes: { type: String, default: "" },
    },
    spriteUrl: { type: String, default: null },
    fullBodyUrl: { type: String, default: null },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
  },
  {
    timestamps: false,
    toJSON: {
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const Character = mongoose.model<ICharacter>("Character", characterSchema);
