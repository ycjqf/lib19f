import { Router } from "express";
import jwt from "jsonwebtoken";
import Article from "@/models/Article";
import { ApiAddArticleRequest, ApiAddArticleResponse } from "@typings/api";
import { sendJSONStatus } from "@/util";

const router = Router();

router.post("/", async (req, res) => {
  const { authorization } = req.headers;
  const decoded = jwt.decode(authorization.replace("Bearer ", ""));
  if (typeof decoded === "string") return sendJSONStatus<ApiAddArticleResponse>(res, { code: "INVALID_TOKEN", message: "令牌负载无效" }, 200);

  if (!req.body.title || typeof req.body.title !== "string" || req.body.title.trim() === "")
    return sendJSONStatus<ApiAddArticleResponse>(res, { code: "EMPTY_TITLE", message: "标题不能为空" }, 200);
  if (!req.body.body || typeof req.body.body !== "string" || req.body.body.trim() === "")
    return sendJSONStatus<ApiAddArticleResponse>(res, { code: "EMPTY_TITLE", message: "内容不能为空" }, 200);

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
    return sendJSONStatus<ApiAddArticleResponse>(res, { code: "OK", message: "成功" }, 200);
  } catch (error) {
    return sendJSONStatus<ApiAddArticleResponse>(res, { code: "INTERNAL_ERROR", message: "存储过程失败" }, 200);
  }
});

export default router;
