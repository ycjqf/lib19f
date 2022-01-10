import { Router } from "express";
import jwt from "jsonwebtoken";
import Article from "@/models/Article";
import { ACESS_TOKEN_SECRET } from "@/psw.json";

const router = Router();

router.post("/", async (req, res) => {
  const { title, description, body } = req.body;
  if (!title || title === "") return res.send("title is required");
  if (!body || body === "") return res.send("body is required");
  const { authorization } = req.headers;
  const decoded = jwt.decode(authorization.replace("Bearer ", ""));

  if (typeof decoded === "string") return res.send("no string payload allowed");
  const article = new Article({
    title: title,
    description: description && typeof description === "string" ? description : "",
    body: body,
    userId: decoded.id,
    poster: "",
  });
  await article.save();
  return res.send("article saved");
});

export default router;
