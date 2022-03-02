import { createConnection, model, Schema } from "mongoose";
import autoIncrement = require("mongoose-auto-increment");
import type { UserDocument } from "tps/ducument";
import { mongoServerString } from "svr/util";

const connection = createConnection(mongoServerString);
autoIncrement.initialize(connection);

const userSchema = new Schema<UserDocument>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdTime: { type: Date, default: () => new Date() },
  updatedTime: { type: Date, default: () => new Date() },
  avatar: { type: String },
  gender: { type: String, required: true },
  introduction: { type: String },
});
userSchema.plugin(autoIncrement.plugin, { model: "User", field: "id", startAt: 1 });
export default model<UserDocument>("User", userSchema);
