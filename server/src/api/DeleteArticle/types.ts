export interface ApiDeleteArticleRequest {
  id: string;
}
export interface ApiDeleteArticleResponse {
  code: BaseResponseCode | "NO_SUCH_ARTICLE" | "NOT_AUTHORIZED";
  message: string;
}
