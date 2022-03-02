import { Router } from "express";
import { ApiUpdateArticleResponse, SessionData } from "tps/api";
import {
  MAX_ARTICLE_CHARS,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_ARTICLE_CHARS,
  MIN_TITLE_LENGTH,
} from "tps/constants";
import Article from "svr/models/Article";
import { sendJSONStatus } from "svr/util";
import User from "svr/models/User";

export default Router().post("/", async (req, res) => {
  const respond = (
    message: ApiUpdateArticleResponse["message"],
    code: ApiUpdateArticleResponse["code"] = "UNAUTHORIZED"
  ) => sendJSONStatus<ApiUpdateArticleResponse>(res, { code, message });
  const inLengthString = (str: unknown, min: number, max: number): boolean =>
    typeof str === "string" && str.length >= min && str.length <= max;

  const session = req.session as typeof req.session & { data: SessionData | undefined };
  if (!session.data) return respond("未登陆");
  if (session.data.capacity !== "user") return respond("无权限");
  if (!(await User.exists({ id: session.data.id }))) return respond("无此用户");
  const updatingArticle = await Article.findOne({ id: req.body.id });
  if (!updatingArticle) return respond("无此文章");
  if (updatingArticle.userId !== session.data.id) return respond("无权限的用户");

  if (session.data.id)
    if (!inLengthString(req.body.title, MIN_TITLE_LENGTH, MAX_TITLE_LENGTH))
      return respond(`标题长度在 ${MIN_TITLE_LENGTH}到${MAX_TITLE_LENGTH} 之间`, "BAD_DATA");
  if (!inLengthString(req.body.description, 0, MAX_DESCRIPTION_LENGTH))
    return respond(`介绍最长到 ${MAX_DESCRIPTION_LENGTH}`, "BAD_DATA");
  if (!inLengthString(req.body.body, MIN_ARTICLE_CHARS, MAX_ARTICLE_CHARS))
    return respond(`内容长度在 ${MIN_ARTICLE_CHARS}到${MAX_ARTICLE_CHARS} 之间`, "BAD_DATA");

  await updatingArticle.update({
    title: req.body.title,
    description: req.body.description,
    body: req.body.body,
    updatedTime: new Date(),
  });
  return respond("成功", "OK");
});
