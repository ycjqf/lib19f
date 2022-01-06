import { createConnection, model, Schema } from "mongoose";
import autoIncrement = require("mongoose-auto-increment");
import type { ArticleDocument } from "@typings/ducument";
import { mongoServerString } from "@/util";

const connection = createConnection(mongoServerString);
autoIncrement.initialize(connection);

const articleSchema = new Schema<ArticleDocument>({
  id: { type: Number, required: true, unique: true },
  description: { type: String, required: true },
  userId: { type: Number, required: true },
  body: { type: String, required: true },
  createdTime: { type: Date, default: () => new Date() },
  updatedTime: { type: Date, default: () => new Date() },
  poster: { type: String, required: true },
});
articleSchema.plugin(autoIncrement.plugin, { model: "Article", field: "id", startAt: 1 });
export default model<ArticleDocument>("Article", articleSchema);
