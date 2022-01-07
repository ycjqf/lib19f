import type { ApiRegisterRequest, ApiRegisterResponse } from "@typings/api";
import type { Request, Response } from "express";
import { accountCapacities } from "@typings/api";
import { Router } from "express";
import validator from "validator";

import User from "@/models/User";
import { sendJSONStatus } from "@/util";
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  NAME_PATTERN,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_PATTERN,
} from "@typings/constants";

const router = Router();

async function handler(req: Request, res: Response) {
  const registerBody: ApiRegisterRequest = {
    name: req.body.name ? `${req.body.name}` : "",
    email: req.body.email ? `${req.body.email}` : "",
    password: req.body.password ? `${req.body.password}` : "",
    passwordRepeat: req.body.passwordRepeat ? `${req.body.passwordRepeat}` : "",
    capacity: req.body.capacity,
  };

  if (
    accountCapacities.find(capacity => capacity === req.body.capacity) === undefined ||
    registerBody.name.length < NAME_MIN_LENGTH ||
    registerBody.name.length > NAME_MAX_LENGTH ||
    !validator.matches(registerBody.name, NAME_PATTERN) ||
    registerBody.password.length < PASSWORD_MIN_LENGTH ||
    registerBody.password.length > PASSWORD_MAX_LENGTH ||
    !validator.matches(registerBody.password, PASSWORD_PATTERN) ||
    !validator.isEmail(registerBody.email) ||
    registerBody.password !== registerBody.passwordRepeat
  )
    return sendJSONStatus<ApiRegisterResponse>(res, { code: "CREDENTIAL_PATTERN_UNMATCH" });

  // TODO 现在还不允许通过接口注册普通用户外的身份
  if (req.body.capacity !== "user") {
    return sendJSONStatus<ApiRegisterResponse>(res, { code: "TODO" });
  }

  if (await User.exists({ name: registerBody.name }))
    return sendJSONStatus<ApiRegisterResponse>(res, { code: "NAME_TAKEN" });
  if (await User.exists({ email: registerBody.email }))
    return sendJSONStatus<ApiRegisterResponse>(res, { code: "EMAIL_TAKEN" });

  try {
    const newUser = new User({
      name: registerBody.name,
      email: registerBody.email,
      password: registerBody.password,
      avatar: "",
      gender: "unset",
      introduction: "",
    });
    await newUser.save();
    return sendJSONStatus<ApiRegisterResponse>(res, { code: "OK" });
  } catch (error) {
    console.log("🐛 注册出错", error);
    return sendJSONStatus<ApiRegisterResponse>(res, { code: "INTERNAL_ERROR" });
  }
}

export default router.post("/", handler);
