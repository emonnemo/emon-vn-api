import mongoose, { Schema, type Document } from "mongoose";

export interface IConfig extends Document {
  key: string;
  value: unknown;
}

const configSchema = new Schema<IConfig>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: false },
);

export const Config = mongoose.model<IConfig>("Config", configSchema);
