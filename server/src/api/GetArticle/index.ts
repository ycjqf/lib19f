import { Router } from "express";
import Article from "svr/models/Article";
import User from "svr/models/User";
import { ApiGetArticleResponse } from "./types";
import { sendJSONStatus } from "svr/util";
import ApiGetArticlePayload from "./payload";

const router = Router();

router.post("/", async (req, res) => {
  const payload = new ApiGetArticlePayload({
    id: req.body.id,
  });
  if (!payload._valid)
    return sendJSONStatus<ApiGetArticleResponse>(res, {
      code: "WRONG_ID",
      message: "id should be positive interger string",
    });

  const article = await Article.findOne({ id: payload.id });
  if (!article)
    return sendJSONStatus<ApiGetArticleResponse>(res, {
      code: "NO_SUCH_ARTICLE",
      message: "no such article",
    });

  const {
    id,
    title,
    description,
    userId,
    body,
    createdTime,
    updatedTime,
    poster,
    status,
    changelog,
  } = article;
  const user = await User.findOne({ id: userId });
  const name = user?.name ?? "unknown";
  const avatar = user?.avatar ?? "";
  return sendJSONStatus<ApiGetArticleResponse>(res, {
    code: "OK",
    message: "success",
    article: {
      id,
      title,
      description,
      userId,
      body,
      status,
      changelog,
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
