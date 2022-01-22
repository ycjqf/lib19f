import { Router } from "express";
import jwt from "jsonwebtoken";

import User from "@/models/User";
import { ACESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, EXPIRE_TIME } from "@/psw.json";
import { sendJSONStatus } from "@/util";
import { ApiLoginRequest, ApiLoginResponse, accountCapacities, accountCapacity } from "@typings/api";
import validator from "validator";
import { NAME_MIN_LENGTH, NAME_MAX_LENGTH, NAME_PATTERN, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_PATTERN } from "@typings/constants";

const router = Router();

router.post("/", async (req, res) => {
  let usingCredential: undefined | "name" | "email" = undefined;
  const loginBody: ApiLoginRequest = {
    name: req.body.name ? `${req.body.name}` : "",
    email: req.body.email ? `${req.body.email}` : "",
    password: req.body.password ? `${req.body.password}` : "",
    capacity: req.body.capacity,
  };

  if (accountCapacities.find(capacity => capacity === loginBody.capacity) === undefined)
    return sendJSONStatus<ApiLoginResponse>(res, { code: "PATTERN_UNMATCH", message: "没有这个身份" });
  console.log(loginBody.capacity, "user", loginBody.capacity !== "user");
  if (loginBody.capacity !== "user") return sendJSONStatus<ApiLoginResponse>(res, { code: "TODO", message: "现在还不允许通过接口注册普通用户外的身份" }, 501);

  if (
    loginBody.password.length < PASSWORD_MIN_LENGTH ||
    loginBody.password.length > PASSWORD_MAX_LENGTH ||
    !validator.matches(loginBody.password, PASSWORD_PATTERN)
  ) {
    return sendJSONStatus<ApiLoginResponse>(res, { code: "PATTERN_UNMATCH", message: "密码模式或长度不匹配" });
  }

  // 优先选择 name 作为凭证
  if (loginBody.name.length >= NAME_MIN_LENGTH && loginBody.name.length <= NAME_MAX_LENGTH && validator.matches(loginBody.name, NAME_PATTERN))
    usingCredential = "name";
  if (usingCredential === undefined && validator.isEmail(loginBody.email)) usingCredential = "email";
  if (usingCredential === undefined) return sendJSONStatus<ApiLoginResponse>(res, { code: "PATTERN_UNMATCH", message: "用户名和账号必须有一个存在" }, 403);

  let queryObject = {};
  if (usingCredential === "name") queryObject = { name: loginBody.name, password: loginBody.password };
  if (usingCredential === "email") queryObject = { email: loginBody.email, password: loginBody.password };
  try {
    const user = await User.findOne(queryObject);
    if (!user) return sendJSONStatus<ApiLoginResponse>(res, { code: "WRONG_CREDENTIAL", message: "用户名或密码错误" });
    const capacity: accountCapacity = "user";
    const forJwt = { id: user.id, capacity };
    const accessToken = jwt.sign(forJwt, ACESS_TOKEN_SECRET, { expiresIn: EXPIRE_TIME });
    const refreshToken = jwt.sign(forJwt, REFRESH_TOKEN_SECRET);

    return sendJSONStatus<ApiLoginResponse>(
      res,
      {
        code: "OK",
        message: "登录成功",
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      200
    );
  } catch (error) {
    console.error("登录出错", error);
    return sendJSONStatus<ApiLoginResponse>(res, { code: "INTERNAL_ERROR", message: "内部错误" }, 500);
  }
});

export default router;
