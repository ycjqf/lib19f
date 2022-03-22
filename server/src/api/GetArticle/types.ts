import { AccountCommon, ArticleDocument } from "tps/ducument";

export interface ApiGetArticleRequest {
  id: string;
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
