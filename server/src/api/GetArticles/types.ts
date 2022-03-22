import { AccountCommon, ArticleDocument } from "tps/ducument";

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
