import { Router } from "express";
import jwt from "jsonwebtoken";

import User from "@/models/User";
import { ACESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/psw.json";
import { sendJSONStatus } from "@/util";
import { ApiAccountLoginRequest, ApiAccountLoginRespond } from "@typings/api";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const loginBody: ApiAccountLoginRequest = {
      name: req.body.name,
      password: req.body.password,
    };
    const document = await User.findOne({ NameForLocate: loginBody.name });

    if (!document || document.password !== loginBody.password)
      return sendJSONStatus<ApiAccountLoginRespond>(res, {
        code: 1,
        message: "no such user or password wrong",
      });

    const user = { name: loginBody.name };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);

    return sendJSONStatus<ApiAccountLoginRespond>(res, {
      code: 0,
      message: "login success",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.log("登陆出错", error);
    return sendJSONStatus<ApiAccountLoginRespond>(res, {
      code: 2,
      message: "bad server",
    });
  }
});

function generateAccessToken(user: { name: string }) {
  return jwt.sign(user, ACESS_TOKEN_SECRET, { expiresIn: "15s" });
}

export default router;
