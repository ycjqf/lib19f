import { Router } from "express";
import Article from "@/models/Article";
import { ApiAddArticleRequest, ApiAddArticleResponse, SessionData } from "@typings/api";
import { sendJSONStatus } from "@/util";
import {
  MAX_ARTICLE_CHARS,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_ARTICLE_CHARS,
  MIN_TITLE_LENGTH,
} from "@typings/constants";
import User from "@/models/User";

const router = Router();

router.post("/", async (req, res) => {
  const respond = (
    message: ApiAddArticleResponse["message"],
    code: ApiAddArticleResponse["code"] = "UNAUTHORIZED"
  ) => sendJSONStatus<ApiAddArticleResponse>(res, { code, message });
  const inLengthString = (str: any, min: number, max: number): boolean =>
    typeof str === "string" && str.trim().length >= min && str.trim().length <= max;

  const session = req.session as typeof req.session & { data: SessionData | undefined };
  if (!session.data) return respond("未登陆");
  if (session.data.capacity !== "user") return respond("无权限");
  if (!(await User.exists({ id: session.data.id }))) return respond("无此用户");

  if (!inLengthString(req.body.title, MIN_TITLE_LENGTH, MAX_TITLE_LENGTH))
    return respond(`标题长度在 ${MIN_TITLE_LENGTH}到${MAX_TITLE_LENGTH} 之间`, "BAD_DATA");
  if (!inLengthString(req.body.description, 0, MAX_DESCRIPTION_LENGTH))
    return respond(`介绍最长到 ${MAX_DESCRIPTION_LENGTH}`, "BAD_DATA");
  if (!inLengthString(req.body.body, MIN_ARTICLE_CHARS, MAX_ARTICLE_CHARS))
    return respond(`内容长度在 ${MIN_ARTICLE_CHARS}到${MAX_ARTICLE_CHARS} 之间`, "BAD_DATA");

  const uploadArticle: ApiAddArticleRequest = {
    title: req.body.title ? `${req.body.title}` : "",
    body: req.body.body ? `${req.body.body}` : "",
    description: req.body.description ? `${req.body.description}` : "",
  };

  const article = new Article({
    title: uploadArticle.title,
    description: uploadArticle.description,
    body: uploadArticle.body,
    userId: session.data.id,
    poster: "",
  });

  try {
    await article.save();
    return respond("成功", "OK");
  } catch (error) {
    return respond("服务器出错", "INTERNAL_ERROR");
  }
});

export default router;
