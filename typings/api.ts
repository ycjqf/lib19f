import { AccountCommon } from "./ducument";

export const accountCapacities = ["user", "reviewer", "admin"] as const;
export type accountCapacity = typeof accountCapacities[number];

// -------- 账户 ACCOUNT --------

// ---- 登录 Api/Account/Login
export interface ApiLoginRequest {
  email: AccountCommon["email"];
  name: AccountCommon["name"];
  password: AccountCommon["password"];
  capacity: accountCapacity;
}
export interface ApiLoginResponse {
  code: "OK" | "PATTERN_UNMATCH" | "WRONG_CREDENTIAL" | "INTERNAL_ERROR" | "TODO";
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

/// 注册 Api/Account/Logout
export interface ApiRegisterRequest {
  name: AccountCommon["name"];
  email: AccountCommon["email"];
  password: AccountCommon["password"];
  passwordRepeat: AccountCommon["password"];
  capacity: accountCapacity;
}
export interface ApiRegisterResponse {
  code: "OK" | "EMAIL_TAKEN" | "NAME_TAKEN" | "PATTERN_UNMATCH" | "INTERNAL_ERROR" | "TODO";
  message: string;
}

/// 更新令牌 /Api/Account/Reauth
/// 请求体的token在header的Authorization中
export interface ApiAccountReauthResponse {
  code: "OK" | "INTERNAL_ERROR" | JwtError;
  message: string;
  accessToken?: string;
}

// -------- 新增 ADD --------
// ---- 文章 /Api/Add/Article
export interface ApiAddArticleRequest {
  title: string;
  description: string;
  body: string;
}
export interface ApiAddArticleResponse {
  code: "OK" | "UNMATCH_TITLE_LENGTH" | "DESCRIPTION_TOO_LONG" | "UNMATCH_BODY_LENGTH" | "INTERNAL_ERROR" | JwtError;
  message: string;
}
// ---- 评论 /Api/Add/Comment
export interface ApiAddCommentRequest {
  targetId: number;
  body: string;
  targetType: "article" | "comment";
}
export interface ApiAddCommentResponse {
  code: "OK" | "INTERNAL_ERROR" | "EMPTY_BODY" | "TODO" | JwtError;
  message: string;
}

// -------- 其他验证错误和类型 --------
export interface AuthenticateError {
  code: JwtError;
  message: string;
}
type JwtError = "REVOKED_TOKEN" | "INVALID_TOKEN" | "CREDENTIALS_BAD_SCHEME" | "CREDENTIALS_BAD_FORMAT" | "CREDENTIALS_REQUIRED";
