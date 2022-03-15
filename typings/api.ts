import { AccountCommon, ArticleDocument, UserDocument } from "./ducument";

export const accountCapacities = ["user", "reviewer", "admin"] as const;
export type AccountCapacity = typeof accountCapacities[number];

// -------- 账户 ACCOUNT --------

// ---- 登录 Api/Account/Login
export interface ApiLoginRequest {
  email: AccountCommon["email"];
  name: AccountCommon["name"];
  password: AccountCommon["password"];
  capacity: AccountCapacity;
}
export interface ApiLoginResponse {
  code: "OK" | "BAD_FORM" | "WRONG_CREDENTIAL" | "INTERNAL_ERROR" | "LOGGED";
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface ApiAccountLogoutReq {
  test: "test";
}
export interface ApiAccountLogoutRes {
  code: "OK" | "INTERNAL_ERROR" | "NOT_LOGGED_IN";
  message: string;
}

/// 注册 Api/Account/Logout
export interface ApiRegisterRequest {
  name: AccountCommon["name"];
  email: AccountCommon["email"];
  password: AccountCommon["password"];
  passwordRepeat: AccountCommon["password"];
  capacity: AccountCapacity;
}
export interface ApiRegisterResponse {
  code: "OK" | "EMAIL_TAKEN" | "NAME_TAKEN" | "PATTERN_UNMATCH" | "INTERNAL_ERROR";
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
  code: "OK" | "BAD_DATA" | "INTERNAL_ERROR" | "UNAUTHORIZED";
  message: string;
}

export interface ApiUpdateArticleRequest {
  id: string;
  title: string;
  description: string;
  body: string;
}
export type ApiUpdateArticleResponse = ApiAddArticleResponse;
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

// ----- 文章分页 /api/get/articles
export interface ApiGetArticlesRequest {
  page: string | null;
  pageSize: string | null;
}
export interface ApiGetArticlesResponse {
  code: "OK" | "WRONG_QUERY" | "INTERNAL_ERROR";
  message: string;
  articles: Array<ArticlePreview>;
  total: number;
  current: number;
  pageSize: number;
}

export interface ApiGetProfileRequest {
  id?: UserDocument["id"];
  name?: UserDocument["name"];
}
export interface ApiGetProfileResponse {
  code: "OK" | "WRONG_ID" | "NO_SUCH_USER" | "INTERNAL_ERROR";
  message: string;
  profile?: {
    id: AccountCommon["id"];
    name: AccountCommon["name"];
    avatar: AccountCommon["avatar"];
  };
}

export interface ApiGetArticleRequest {
  id: string;
}
export interface ApiDeleteArticleRequest {
  id: string;
}
export interface ApiDeleteArticleResponse {
  code: "OK" | "WRONG_ID" | "NO_SUCH_ARTICLE" | "NOT_AUTHORIZED" | "INTERNAL_ERROR";
  message: string;
}
export interface ApiGetArticleResponse {
  code: "OK" | "WRONG_ID" | "NO_SUCH_ARTICLE" | "INTERNAL_ERROR";
  message: string;
  article?: ArticleDocument;
  profile?: {
    id: AccountCommon["id"];
    name: AccountCommon["name"];
    avatar: AccountCommon["avatar"];
  };
}

// -------- 其他验证错误和类型 --------
export interface AuthenticateError {
  code: JwtError;
  message: string;
}
type JwtError =
  | "REVOKED_TOKEN"
  | "INVALID_TOKEN"
  | "CREDENTIALS_BAD_SCHEME"
  | "CREDENTIALS_BAD_FORMAT"
  | "CREDENTIALS_REQUIRED";

export interface ArticlePreview {
  id: ArticleDocument["id"];
  title: ArticleDocument["title"];
  description: ArticleDocument["description"];
  poster: ArticleDocument["poster"];
  profile: {
    id: AccountCommon["id"];
    name: AccountCommon["name"];
    avatar: AccountCommon["avatar"];
  };
  createdTime: ArticleDocument["createdTime"];
  updatedTime: ArticleDocument["updatedTime"];
}

export const basicCodes = ["OK", "INTERNAL_ERROR", "WRONG_PARAMS"] as const;
export type BasicCode = typeof basicCodes[number];

export interface GetArticlesReq {
  q: string | undefined;
  page: number | undefined;
  pageSize: number | undefined;
  userId: UserDocument["id"] | undefined;
  sort: "CREATED_UP" | "UPDATED_UP" | undefined;
}
export interface GetArticlesRes {
  code: BasicCode;
  message: string;
  current: number;
  total: number;
  pageSize: number;
  articles: Array<ArticlePreview>;
}

export interface SessionData {
  id: AccountCommon["id"];
  capacity: AccountCapacity;
}

export type AuthenticateRes = {
  isLogged: boolean;
  message: string;
  data?: SessionData;
  profile?: ApiGetProfileResponse["profile"];
};
