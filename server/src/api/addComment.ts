import { Router } from "express";
import jwt from "jsonwebtoken";
import Comment from "@/models/Comment";
import { commentTargetTypes } from "@typings/ducument";
import Article from "@/models/Article";

const router = Router();

router.post("/", async (req, res) => {
  // must have targetType with types
  // must have targetId and exist
  // must have body within limit lenth
  const { targetId, targetType, body } = req.body;
  if (!body || body === "") return res.send("body is required");
  if (!targetType || commentTargetTypes.indexOf(targetType) === -1) return res.send("targetType is invalid");
  if (targetType === "comment") return res.send("can't reply currently");

  if (targetType === "article") {
    const isExist = await Article.findOne({ id: targetId });
    if (!isExist) return res.send("no this article exist");
    const { authorization } = req.headers;
    const decoded = jwt.decode(authorization.replace("Bearer ", ""));
    if (typeof decoded === "string") return res.send("no string payload allowed");
    const comment = new Comment({
      body: body,
      userId: decoded.id,
      targetType: targetType,
      targetId: targetId,
    });
    await comment.save();
    return res.send("comment saved");
  } else return res.send("unknown targetType");
});

export default router;
