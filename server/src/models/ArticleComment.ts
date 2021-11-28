import { createConnection, model, Schema } from "mongoose";
import "@typings/ducument";

import { mongoServerString } from "@/util";

import autoIncrement = require("mongoose-auto-increment");

const connection = createConnection(mongoServerString);
autoIncrement.initialize(connection);

const articleCommentSchema = new Schema<ArticleCommentDocument>({
  id: { type: Number, required: true },
  targetArticleId: { type: Number, required: true },
  targetCommentId: { type: Number, default: 0 },
  userId: { type: Number, required: true },
  body: { type: String, required: true },
  upvotedAccountIds: { type: [Number], default: [] },
  downvotedAccountIds: { type: [Number], default: [] },
  createdTime: { type: Date, default: () => new Date() },
  updatedTime: { type: Date, default: () => new Date() },
});
articleCommentSchema.plugin(autoIncrement.plugin, {
  model: "ArticleComment",
  field: "id",
  startAt: 1,
});
export default model<ArticleCommentDocument>("ArticleComment", articleCommentSchema);
