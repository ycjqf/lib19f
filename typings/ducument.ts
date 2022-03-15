export interface AccountCommon {
  id: number;
  name: string;
  email: string;
  password: string;
  createdTime: Date;
  updatedTime: Date;
  avatar: string;
  gender: "unset" | "male" | "female";
  introduction: string;
  status: "ok" | "baned";
}

export type UserDocument = AccountCommon;
export type ReviewerDocument = AccountCommon;
export type AdminDocument = AccountCommon;

export interface ArticleDocument {
  id: number;
  title: string;
  description: string;
  userId: number;
  body: string;
  createdTime: Date;
  updatedTime: Date;
  poster: string;
  status: "pending" | "approved" | "rejected";
  changelog: {
    reviewerId: number | undefined;
    time: Date;
  }[];
}

export const commentTargetTypes = ["comment", "article"] as const;
export type commentTargetType = typeof commentTargetTypes[number];

export interface CommentDocument {
  id: number;
  targetType: commentTargetType;
  targetId: number;
  body: string;
  userId: number;
  createdTime: Date;
  updatedTime: Date;
}
