import { createConnection, model, Schema } from "mongoose";
import autoIncrement = require("mongoose-auto-increment");
import type { AdminDocument } from "tps/ducument";
import { mongoServerString } from "svr/util";

const connection = createConnection(mongoServerString);
autoIncrement.initialize(connection);

const adminSchema = new Schema<AdminDocument>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdTime: { type: Date, default: () => new Date() },
  updatedTime: { type: Date, default: () => new Date() },
  avatar: { type: String, required: true },
});
adminSchema.plugin(autoIncrement.plugin, { model: "Admin", field: "id", startAt: 1 });
export default model<AdminDocument>("Admin", adminSchema);
