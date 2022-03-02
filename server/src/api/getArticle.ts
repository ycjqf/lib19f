import { Router } from "express";
import { ApiGetArticleRequest, ApiGetArticleResponse } from "tps/api";
import { sendJSONStatus } from "svr/util";
import Article from "svr/models/Article";
import User from "svr/models/User";

const router = Router();

router.post("/", async (req, res) => {
  const parsed: ApiGetArticleRequest = {
    id: req.body.id,
  };

  if (typeof parsed.id !== "string" || !/^[1-9]\d*$/.test(parsed.id))
    return sendJSONStatus<ApiGetArticleResponse>(res, {
      code: "WRONG_ID",
      message: "id需为正整数",
    });

  const article = await Article.findOne({ id: parseInt(parsed.id) });
  if (!article)
    return sendJSONStatus<ApiGetArticleResponse>(res, {
      code: "NO_SUCH_ARTICLE",
      message: "没有这个文章",
    });

  const { id, title, description, userId, body, createdTime, updatedTime, poster } = article;
  const user = await User.findOne({ id: userId });
  const { name, avatar } = user;
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
    profile: {
      id: userId,
      name,
      avatar,
    },
  });
});

export default router;
