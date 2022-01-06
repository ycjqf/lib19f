export interface AccountCommon {
  id: number;
  name: string;
  email: string;
  password: string;
  createdTime: Date;
  updatedTime: Date;
  avatar: string;
}

export interface UserDocument extends AccountCommon {
  gender: "unset" | "male" | "female";
  introduction: string;
}

export interface ReviewerDocument extends AccountCommon {}
export interface AdminDocument extends AccountCommon {}

export interface ArticleDocument {
  id: number;
  description: string;
  userId: number;
  body: string;
  createdTime: Date;
  updatedTime: Date;
  poster: string;
}

export interface CommentDocument {
  id: number;
  targetType: "comment" | "article";
  targetId: number;
  body: string;
  userId: number;
  createdTime: Date;
  updatedTime: Date;
}
