import express from "express";
import accountLogin from "svr/api/AccountLogin";
import accountLogout from "svr/api/AccountLogout";
import accountRegister from "svr/api/AccountRegister";
import accountRegisterCheckName from "svr/api/AccountRegisterCheckName";
import accountRegisterCheckEmail from "svr/api/AccountRegisterCheckEmail";
import addArticle from "svr/api/AddArticle";
import getArticles from "svr/api/GetArticles";
import getProfile from "svr/api/GetProfile";
import getArticle from "svr/api/GetArticle";
import deleteArticle from "svr/api/DeleteArticle";
import authenticate from "svr/api/Authenticate";
import updateArticle from "svr/api/UpdateArticle";

const router = express.Router();

router.use("/api/account/login", accountLogin);
router.use("/api/account/logout", accountLogout);
router.use("/api/account/register", accountRegister);
router.use("/api/account/register/check-name", accountRegisterCheckName);
router.use("/api/account/register/check-email", accountRegisterCheckEmail);
router.use("/api/add/article", addArticle);
router.use("/api/delete/article", deleteArticle);
router.use("/api/update/article", updateArticle);
router.use("/api/get/articles", getArticles);
router.use("/api/get/article", getArticle);
router.use("/api/get/profile", getProfile);
router.use("/api/authenticate", authenticate);

export default router;
