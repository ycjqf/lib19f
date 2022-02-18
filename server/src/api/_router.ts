import express, { Response, Request, NextFunction } from "express";
import expressJwt, { ErrorCode } from "express-jwt";
import cookieParser from "cookie-parser";
import accountLogin from "@/api/accountLogin";
import accountRegister from "@/api/accountRegister";
import accountReauth from "@/api/accountReauth";
import addArticle from "@/api/addArticle";
import addComment from "@/api/addComment";
import getArticles from "@/api/getArticles";
import getProfile from "@/api/getProfile";
import getArticle from "@/api/getArticle";
import { ACESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/psw.json";
import { sendJSONStatus } from "@/util";
import { AuthenticateError } from "@typings/api";
import moment from "moment";
moment.locale("zh-cn");

const router = express.Router();

router.use(express.json());
router.use(cookieParser());
router.use(/^\/api\/(add|update|upload|delete)\/.*/, expressJwt({ secret: ACESS_TOKEN_SECRET, algorithms: ["HS256"] }));
router.use("/api/account/reauth", expressJwt({ secret: REFRESH_TOKEN_SECRET, algorithms: ["HS256"] }));
router.use((req, res, next) => {
  console.log(req.cookies);
  console.log(`${req.method}[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${req.url} <== ${req.ip}`);
  next();
});
router.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    sendJSONStatus<{ code: string; message: string }>(res, { code: "INTERNAL_ERROR", message: error.message });
  } else if (error.name === "UnauthorizedError") {
    let code: AuthenticateError["code"] = "INVALID_TOKEN";
    let message = "";
    switch (error.code as ErrorCode) {
      case "invalid_token": {
        code = "INVALID_TOKEN";
        message = "令牌无效";
      }
      case "revoked_token": {
        code = "REVOKED_TOKEN";
        message = "token 已被撤销";
      }
      case "credentials_bad_scheme": {
        code = "CREDENTIALS_BAD_SCHEME";
        message = "无效的凭证字符串";
      }
      case "credentials_bad_format": {
        code = "CREDENTIALS_BAD_FORMAT";
        message = "无效的凭证模式";
      }
      case "credentials_required": {
        code = "CREDENTIALS_REQUIRED";
        message = "需要凭证";
      }
    }
    return sendJSONStatus<AuthenticateError>(res, { code: code, message: message }, 200);
  } else next();
});

router.use("/api/account/register", accountRegister);
router.use("/api/account/login", accountLogin);
router.use("/api/account/reauth", accountReauth);
router.use("/api/add/article", addArticle);
router.use("/api/add/comment", addComment);
router.use("/api/get/articles", getArticles);
router.use("/api/get/article", getArticle);
router.use("/api/get/profile", getProfile);

router.all("/", (req, res) => {
  return res.end("lib19f的后端服务，查看readme.md以了解更多");
});
router.all("*", (req, res) => {
  res.status(404);
  return res.end(`无效接口 invalid api`);
});

export default router;
