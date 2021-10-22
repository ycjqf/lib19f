import { Router } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import User from "@/models/User";
import { ACESS_TOKEN_SECRET } from "@/psw.json";
import { sendJSONStatus } from "@/utils/util";

import type { NextFunction, Request, Response } from "express";
const router = Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    console.log(res.locals.user);
    console.log(`this token is valid and ${res.locals.user.name} surpassed it`);
    return res.end("bugy");
  } catch (error) {
    return res.end("bugy");
  }
});

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader ? authHeader.split(" ")[1] : undefined;
  if (!token)
    return sendJSONStatus<d.ApiAccountLoginRespond>(res, {
      code: 1,
      message: "出错，没有登陆",
    });

  jwt.verify(token, ACESS_TOKEN_SECRET, (error, user) => {
    if (error instanceof TokenExpiredError) {
      return sendJSONStatus<d.ApiAccountLoginRespond>(res, {
        code: 2,
        message: "出错，登陆超时",
      });
    }
    if (error) {
      return sendJSONStatus<d.ApiAccountLoginRespond>(res, {
        code: 2,
        message: "出错，没有权限",
      });
    }
    res.locals.user = user;
    next();
  });
}

export default router;

namespace d {
  export interface ApiAccountLoginRespond {
    /** 0 登陆成功 1 密码错误或用户不存在 2 登陆时服务出错 */
    code: 0 | 1 | 2;
    message: string;
    accessToken?: string;
    refreshToken?: string;
  }
  export interface ApiAccountLoginRequest {
    name: string;
    password: string;
  }
}
