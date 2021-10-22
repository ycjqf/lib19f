import { model, Schema } from "mongoose";

interface User {
  ID: string;
  Name: string;
  Password: string;
  AvatarPath: string;
  Gender: string;
  Introduction: string;
  CreatedTime: Date;
}
const userSceme = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
});

export default model<User>("User", userSceme);
