import { Router } from "express";
import jwt from "jsonwebtoken";
import Article from "@/models/Article";
import { ApiAddArticleRequest, ApiAddArticleResponse } from "@typings/api";
import { sendJSONStatus } from "@/util";
import { MAX_ARTICLE_CHARS, MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH, MIN_TITLE_LENGTH } from "@typings/constants";

const router = Router();

router.post("/", async (req, res) => {
  const { authorization } = req.headers;
  const decoded = jwt.decode(authorization.replace("Bearer ", ""));
  if (typeof decoded === "string") return sendJSONStatus<ApiAddArticleResponse>(res, { code: "INVALID_TOKEN", message: "令牌负载无效" });

  if (
    !req.body.title ||
    typeof req.body.title !== "string" ||
    req.body.title.trim().length > MIN_TITLE_LENGTH ||
    req.body.title.trim().length > MAX_TITLE_LENGTH
  )
    return sendJSONStatus<ApiAddArticleResponse>(res, { code: "UNMATCH_TITLE_LENGTH", message: `标题长度不对` });
  if (!req.body.description || typeof req.body.description !== "string" || req.body.description.trim().length > MAX_DESCRIPTION_LENGTH)
    return sendJSONStatus<ApiAddArticleResponse>(res, { code: "UNMATCH_TITLE_LENGTH", message: `介绍太长` });
  if (!req.body.body || typeof req.body.body !== "string" || req.body.body.trim() === "" || req.body.body.trim().length > MAX_ARTICLE_CHARS)
    return sendJSONStatus<ApiAddArticleResponse>(res, { code: "UNMATCH_BODY_LENGTH", message: "内容长度不对" });

  const uploadArticle: ApiAddArticleRequest = {
    title: req.body.title ? `${req.body.title}` : "",
    body: req.body.body ? `${req.body.body}` : "",
    description: req.body.description ? `${req.body.description}` : "",
  };

  const article = new Article({
    title: uploadArticle.title,
    description: uploadArticle.description,
    body: uploadArticle.body,
    userId: decoded.id,
    poster: "",
  });

  try {
    await article.save();
    return sendJSONStatus<ApiAddArticleResponse>(res, { code: "OK", message: "成功" });
  } catch (error) {
    return sendJSONStatus<ApiAddArticleResponse>(res, { code: "INTERNAL_ERROR", message: "存储过程失败" });
  }
});

export default router;
