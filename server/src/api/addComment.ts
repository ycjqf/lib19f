import { Router } from "express";
import jwt from "jsonwebtoken";
import Comment from "@/models/Comment";
import { commentTargetTypes } from "@typings/ducument";
import Article from "@/models/Article";
import { ApiAddCommentRequest, ApiAddCommentResponse } from "@typings/api";
import { sendJSONStatus } from "@/util";

const router = Router();

router.post("/", async (req, res) => {
  const { authorization } = req.headers;
  const decoded = jwt.decode(authorization.replace("Bearer ", ""));
  if (typeof decoded === "string") return sendJSONStatus<ApiAddCommentResponse>(res, { code: "INVALID_TOKEN", message: "令牌负载无效" });

  if (!req.body.body || typeof req.body.body !== "string" || req.body.body.trim() === "")
    return sendJSONStatus<ApiAddCommentResponse>(res, { code: "EMPTY_BODY", message: "内容不能为空" });
  if (!req.body.targetType || typeof req.body.targetType !== "string" || !commentTargetTypes.includes(req.body.targetType))
    return sendJSONStatus<ApiAddCommentResponse>(res, { code: "EMPTY_BODY", message: "评论类型不能为空" });
  if (!req.body.targetId || typeof req.body.targetId !== "number")
    return sendJSONStatus<ApiAddCommentResponse>(res, { code: "EMPTY_BODY", message: "评论对象有误" });

  if (req.body.targetType === "article" && !(await Article.exists({ id: req.body.targetId })))
    return sendJSONStatus<ApiAddCommentResponse>(res, { code: "TODO", message: "没有这篇文章" });
  if (req.body.targetType === "comment" && !(await Comment.exists({ id: req.body.targetId })))
    return sendJSONStatus<ApiAddCommentResponse>(res, { code: "TODO", message: "没有这条评论" });

  const commentRequest: ApiAddCommentRequest = {
    targetId: req.body.targetId,
    targetType: req.body.targetType,
    body: req.body.body,
  };
  const comment = new Comment({
    userId: decoded.id,
    ...commentRequest,
  });
  try {
    await comment.save();
    return sendJSONStatus<ApiAddCommentResponse>(res, { code: "OK", message: "成功" });
  } catch (error) {
    return sendJSONStatus<ApiAddCommentResponse>(res, { code: "INTERNAL_ERROR", message: "存储失败" });
  }
});

export default router;
