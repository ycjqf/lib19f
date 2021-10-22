import { model, Schema } from "mongoose";

interface Comment {
  ID: string;
  UserID: string;
  TargetItemID: string;
  TargetItemType: string;
  TargetCommentID: string;
  CreatedTime: string;
  Content: string;
  LikedUserIDs: Array<string>;
  DislikedUserIDs: Array<string>;
  Status: "BLOCKED__FOR__CHECK" | "FINE" | "DELETED__BY__SELF";
}
const userSceme = new Schema<Comment>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
});

export default model<Comment>("User", userSceme);
