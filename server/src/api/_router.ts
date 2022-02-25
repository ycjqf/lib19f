import express from "express";
import accountLogin from "@/api/accountLogin";
import accountRegister from "@/api/accountRegister";
import accountLogout from "@/api/accountLogout";
import addArticle from "@/api/addArticle";
import addComment from "@/api/addComment";
import getArticles from "@/api/getArticles";
import getProfile from "@/api/getProfile";
import getArticle from "@/api/getArticle";
import deleteArticle from "./deleteArticle";
import authenticate from "@/api/authenticate";

const router = express.Router();
router.use("/api/account/register", accountRegister);
router.use("/api/account/login", accountLogin);
router.use("/api/account/logout", accountLogout);
router.use("/api/add/article", addArticle);
router.use("/api/delete/article", deleteArticle);
router.use("/api/add/comment", addComment);
router.use("/api/get/articles", getArticles);
router.use("/api/get/article", getArticle);
router.use("/api/get/profile", getProfile);
router.use("/api/authenticate", authenticate);
router.all("/", (req, res) => res.end("backend api for lib19f, check source code for more"));
router.all("*", (req, res) =>
  res.status(404).json({ code: "NOT_FOUND", message: "invalid api" })
);
export default router;
