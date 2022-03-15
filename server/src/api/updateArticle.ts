import { Router } from "express";
import { ApiUpdateArticleResponse, SessionData } from "tps/api";
import Article from "svr/models/Article";
import { sendJSONStatus } from "svr/util";
import User from "svr/models/User";
import { ApiAddArticlePayload } from "./addArticle";

export default Router().post("/", async (req, res) => {
  const respond = (
    message: ApiUpdateArticleResponse["message"],
    code: ApiUpdateArticleResponse["code"] = "UNAUTHORIZED"
  ) => sendJSONStatus<ApiUpdateArticleResponse>(res, { code, message });

  const session = req.session as typeof req.session & { data: SessionData | undefined };
  if (!session.data) return respond("未登陆");
  if (session.data.capacity !== "user") return respond("无权限");
  if (!(await User.exists({ id: session.data.id }))) return respond("无此用户");
  const updatingArticle = await Article.findOne({ id: req.body.id });
  if (!updatingArticle) return respond("无此文章");
  if (updatingArticle.userId !== session.data.id) return respond("无权限的用户");

  const payload = new ApiAddArticlePayload({
    title: req.body.title,
    description: req.body.description,
    body: req.body.body,
  });
  if (!payload._valid) return respond(payload._message, "BAD_DATA");

  await updatingArticle.update({
    title: payload.title,
    description: payload.description,
    body: payload.body,
    updatedTime: new Date(),
  });
  return respond("成功", "OK");
});
