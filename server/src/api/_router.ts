import express, { Response, Request, NextFunction } from "express";
import expressJwt, { ErrorCode } from "express-jwt";
import accountLogin from "@/api/accountLogin";
import accountRegister from "@/api/accountRegister";
import accountReauth from "@/api/accountReauth";
import addArticle from "@/api/addArticle";
import addComment from "@/api/addComment";
import { ACESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/psw.json";
import { sendJSONStatus } from "@/util";
import { AuthenticateError } from "@typings/api";

const router = express.Router();

router.use(/^\/api\/(add|update|upload|delete)\/.*/, expressJwt({ secret: ACESS_TOKEN_SECRET, algorithms: ["HS256"] }));
router.use("/api/account/reauth", expressJwt({ secret: REFRESH_TOKEN_SECRET, algorithms: ["HS256"] }));
router.use((err, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "UnauthorizedError") {
    let code: AuthenticateError["code"] = "INVALID_TOKEN";
    let message = "";
    switch (err.code as ErrorCode) {
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
    return sendJSONStatus<AuthenticateError>(
      res,
      {
        code: code,
        message: message,
      },
      401
    );
  }
  next();
});

router.use("/api/account/register", accountRegister);
router.use("/api/account/login", accountLogin);
router.use("/api/account/reauth", accountReauth);
router.use("/api/add/article", addArticle);
router.use("/api/add/comment", addComment);

export default router;
