import { createConnection, model, Schema } from "mongoose";

import { mongoServerString } from "@/util";

import autoIncrement = require("mongoose-auto-increment");

const connection = createConnection(mongoServerString);
autoIncrement.initialize(connection);

const articleSchema = new Schema<ArticleDocument>({
  id: { type: Number, required: true, unique: true },
  accountId: { type: Number, required: true },
  title: { type: String, required: true },
  introduction: { type: String, default: "" },
  poster: { type: String, default: "/raw-images/article_posters/_default.png" },
  createdTime: { type: Date, default: () => new Date() },
  updatedTime: { type: Date, default: () => new Date() },
});
articleSchema.plugin(autoIncrement.plugin, { model: "Article", field: "id", startAt: 1 });
export default model<ArticleDocument>("Article", articleSchema);
