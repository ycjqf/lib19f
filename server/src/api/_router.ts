import express, { NextFunction, Request, Response } from "express";
import accountLogin from "svr/api/accountLogin";
import accountRegister from "svr/api/accountRegister";
import accountLogout from "svr/api/accountLogout";
import addArticle from "svr/api/addArticle";
import getArticles from "svr/api/getArticles";
import getProfile from "svr/api/getProfile";
import getArticle from "svr/api/getArticle";
import deleteArticle from "svr/api/deleteArticle";
import authenticate from "svr/api/authenticate";
import updateArticle from "svr/api/updateArticle";

const router = express.Router();

router.use("/api/account/register", accountRegister);
router.use("/api/account/login", accountLogin);
router.use("/api/account/logout", accountLogout);
router.use("/api/add/article", addArticle);
router.use("/api/delete/article", deleteArticle);
router.use("/api/update/article", updateArticle);
router.use("/api/get/articles", getArticles);
router.use("/api/get/article", getArticle);
router.use("/api/get/profile", getProfile);
router.use("/api/authenticate", authenticate);
router.all("*", (_, res) => res.status(404).json({ code: "NOT_FOUND", message: "invalid" }));

export default router;
