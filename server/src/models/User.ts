import { createConnection, model, Schema } from 'mongoose';

import { mongoServerString } from '@/utils/util';

import autoIncrement = require("mongoose-auto-increment");
const connection = createConnection(mongoServerString)
autoIncrement.initialize(connection);

const userSchema = new Schema<UserDocument>({
  ID: { type: Number, required: true, indexes: true },
  NameForView: { type: String, required: true },
  NameForLocate: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  AvatarPath: { type: String, required: false, default: undefined },
  Gender: { type: Number, default: 0 },
  Introduction: { type: String, default: undefined },
  CreatedTime: { type: Date, default: () => new Date() },
});
userSchema.plugin(autoIncrement.plugin, { model: "User", field: "ID", startAt: 1 });
const User = model<UserDocument>("User", userSchema);

export default User;
