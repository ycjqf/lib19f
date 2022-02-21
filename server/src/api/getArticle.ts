import { Router } from "express";
import { ApiGetArticleRequest, ApiGetArticleResponse } from "@typings/api";
import { sendJSONStatus } from "@/util";
import Article from "@/models/Article";

const router = Router();

router.post("/", async (req, res) => {
  const parsed: ApiGetArticleRequest = {
    id: req.body.id,
  };

  if (typeof parsed.id !== "string" || !/^[1-9]\d*$/.test(parsed.id))
    return sendJSONStatus<ApiGetArticleResponse>(res, { code: "WRONG_ID", message: "id需为正整数" });

  const article = await Article.findOne({ id: parseInt(parsed.id) });
  if (!article) return sendJSONStatus<ApiGetArticleResponse>(res, { code: "NO_SUCH_ARTICLE", message: "没有这个文章" });

  const { id, title, description, userId, body, createdTime, updatedTime, poster } = article;
  return sendJSONStatus<ApiGetArticleResponse>(res, {
    code: "OK",
    message: "success",
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
