import { createConnection, model, Schema } from "mongoose";
import autoIncrement = require("mongoose-auto-increment");
import type { ReviewerDocument } from "@typings/ducument";
import { mongoServerString } from "@/util";

const connection = createConnection(mongoServerString);
autoIncrement.initialize(connection);

const reviewerSchema = new Schema<ReviewerDocument>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdTime: { type: Date, default: () => new Date() },
  updatedTime: { type: Date, default: () => new Date() },
  avatar: { type: String, required: true },
});
reviewerSchema.plugin(autoIncrement.plugin, { model: "Reviewer", field: "id", startAt: 1 });
export default model<ReviewerDocument>("Reviewer", reviewerSchema);
