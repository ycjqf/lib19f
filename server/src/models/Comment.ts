import { createConnection, model, Schema } from "mongoose";
import autoIncrement = require("mongoose-auto-increment");
import type { CommentDocument } from "@typings/ducument";
import { mongoServerString } from "@/util";

const connection = createConnection(mongoServerString);
autoIncrement.initialize(connection);

const commentSchema = new Schema<CommentDocument>({
  id: { type: Number, required: true, unique: true },
  targetType: { type: String, required: true },
  targetId: { type: Number, required: true },
  body: { type: String, required: true },
  userId: { type: Number, required: true },
  createdTime: { type: Date, default: () => new Date() },
  updatedTime: { type: Date, default: () => new Date() },
});
commentSchema.plugin(autoIncrement.plugin, { model: "Comment", field: "id", startAt: 1 });
export default model<CommentDocument>("Comment", commentSchema);
