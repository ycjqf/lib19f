import { createConnection, model, Schema } from "mongoose";

import { mongoServerString } from "@/util";

import autoIncrement = require("mongoose-auto-increment");

const connection = createConnection(mongoServerString);
autoIncrement.initialize(connection);

const managerSchema = new Schema<ManagerDocument>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: Number, default: 0 },
  introduction: { type: String, default: "" },
  avatar: { type: String, default: "/raw-images/avatars/_default-manager.png" },
  createdTime: { type: Date, default: () => new Date() },
  updatedTime: { type: Date, default: () => new Date() },

  compacity: { type: Number, required: true },
});
managerSchema.plugin(autoIncrement.plugin, { model: "Manager", field: "id", startAt: 1 });
export default model<AccountDocument>("Manager", managerSchema);
