export interface ApiAddArticleRequest {
  title: string;
  description: string;
  body: string;
}

export interface ApiAddArticleResponse {
  code: BaseResponseCode | "UNAUTHORIZED";
  message: string;
}
