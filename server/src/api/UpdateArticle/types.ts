import { ApiAddArticleResponse } from "../AddArticle/types";

export interface ApiUpdateArticleRequest {
  id: string;
  title: string;
  description: string;
  body: string;
}

export type ApiUpdateArticleResponse = ApiAddArticleResponse;
