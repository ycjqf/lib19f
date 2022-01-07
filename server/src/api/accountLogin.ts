import { Router } from "express";
import jwt from "jsonwebtoken";

import User from "@/models/User";
import { ACESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/psw.json";
import { sendJSONStatus } from "@/util";
import { ApiLoginRequest, ApiLoginResponse, accountCapacities } from "@typings/api";
import validator from "validator";
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  NAME_PATTERN,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_PATTERN,
} from "@typings/constants";

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
    return sendJSONStatus<ApiLoginResponse>(res, { code: "CREDENTIAL_PATTERN_UNMATCH" });
  // TODO 现在还不允许通过接口注册普通用户外的身份
  if (req.body.capacity !== "user") {
    return sendJSONStatus<ApiLoginResponse>(res, { code: "TODO" });
  }
  if (
    loginBody.password.length < PASSWORD_MIN_LENGTH ||
    loginBody.password.length > PASSWORD_MAX_LENGTH ||
    !validator.matches(loginBody.password, PASSWORD_PATTERN)
  ) {
    return sendJSONStatus<ApiLoginResponse>(res, { code: "CREDENTIAL_PATTERN_UNMATCH" });
  }

  // 优先选择 name 作为凭证
  if (
    loginBody.name.length >= NAME_MIN_LENGTH &&
    loginBody.name.length <= NAME_MAX_LENGTH &&
    validator.matches(loginBody.name, NAME_PATTERN)
  )
    usingCredential = "name";
  if (usingCredential === undefined && validator.isEmail(loginBody.email))
    usingCredential = "email";
  if (usingCredential === undefined)
    return sendJSONStatus<ApiLoginResponse>(res, { code: "CREDENTIAL_PATTERN_UNMATCH" });

  let queryObject = {};
  if (usingCredential === "name")
    queryObject = { name: loginBody.name, password: loginBody.password };
  if (usingCredential === "email")
    queryObject = { email: loginBody.email, password: loginBody.password };
  try {
    const user = await User.findOne(queryObject);
    if (!user) return sendJSONStatus<ApiLoginResponse>(res, { code: "WRONG_CREDENTIAL" });

    const forJwt = { name: loginBody.name };
    const accessToken = jwt.sign(forJwt, ACESS_TOKEN_SECRET, { expiresIn: "15s" });
    const refreshToken = jwt.sign(forJwt, REFRESH_TOKEN_SECRET);

    return sendJSONStatus<ApiLoginResponse>(res, {
      code: "OK",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error("登录出错", error);
    return sendJSONStatus<ApiLoginResponse>(res, { code: "INTERNAL_ERROR" });
  }
});

export default router;
