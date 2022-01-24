import { Router } from "express";
import { ApiGetArticleRequest, ApiGetArticleResponse } from "@typings/api";
import { sendJSONStatus } from "@/util";
import Article from "@/models/Article";

const router = Router();

router.post("/", async (req, res) => {
  const parsed: ApiGetArticleRequest = {
    id: req.body.id,
  };

  if (typeof parsed.id !== "number" || parsed.id <= 0 || parsed.id !== parseInt(`${parsed.id}`, 10))
    return sendJSONStatus<ApiGetArticleResponse>(res, { code: "WRONG_ID", message: "id需为正整数" });

  const article = await Article.findOne({ id: parsed.id });
  if (!article) return sendJSONStatus<ApiGetArticleResponse>(res, { code: "NO_SUCH_ARTICLE", message: "没有这个文章" });

  const { id, title, description, userId, body, createdTime, updatedTime, poster } = article;
  return sendJSONStatus<ApiGetArticleResponse>(res, {
    code: "OK",
    message: "用户查询成功",
    article: {
      id,
      title,
      description,
      userId,
      body,
      createdTime,
      updatedTime,
      poster,
    },
  });
});

export default router;
