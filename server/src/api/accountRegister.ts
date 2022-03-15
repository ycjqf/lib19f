import type { ApiRegisterResponse } from "tps/api";
import type { Request, Response } from "express";
import { Router } from "express";
import validator from "validator";
import User from "svr/models/User";
import { sendJSONStatus } from "svr/util";
import { NAME_PATTERN, PASSWORD_PATTERN } from "tps/constants";
import isEmail from "validator/lib/isEmail";

const router = Router();
router.post("/", async (req: Request, res: Response) => {
  const currentResponse: ApiRegisterResponse = { code: "PATTERN_UNMATCH", message: "" };
  const setMsgNReturn = (msg: string) => {
    currentResponse.message = msg;
    return sendJSONStatus<ApiRegisterResponse>(res, currentResponse);
  };
  const payload = new ApiAccountRegisterPayload({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordRepeat: req.body.passwordRepeat,
  });
  if (!payload._valid) {
    return sendJSONStatus<ApiRegisterResponse>(res, {
      code: "PATTERN_UNMATCH",
      message: payload._message,
    });
  }

  if (await User.exists({ name: payload.name })) {
    return sendJSONStatus<ApiRegisterResponse>(res, {
      code: "NAME_TAKEN",
      message: "name is already taken",
    });
  }

  if (await User.exists({ email: payload.email })) {
    return sendJSONStatus<ApiRegisterResponse>(res, {
      code: "EMAIL_TAKEN",
      message: "email is already taken",
    });
  }

  try {
    currentResponse.code = "OK";
    const newUser = new User({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      avatar: "",
      gender: "unset",
      introduction: "",
    });
    await newUser.save();
    return setMsgNReturn(`register success`);
  } catch (e) {
    currentResponse.code = "INTERNAL_ERROR";
    return setMsgNReturn(`register failed ${e instanceof Error ? e.message : "unknown error"}`);
  }
});

type CheckResult = { status: "ERROR" | "TAKEN" | "WRONG" | "OK" };
router.post("/check-name", async (req: Request, res: Response) => {
  const name: string | undefined =
    typeof req.body.name === "string" && NAME_PATTERN.test(req.body.name)
      ? req.body.name
      : undefined;

  if (typeof name === "undefined") {
    return sendJSONStatus<CheckResult>(res, {
      status: "WRONG",
    });
  }

  try {
    const existName = await User.exists({ name });
    return sendJSONStatus<CheckResult>(res, {
      status: existName ? "TAKEN" : "OK",
    });
  } catch (e) {
    return sendJSONStatus<CheckResult>(res, {
      status: "ERROR",
    });
  }
});

router.post("/check-email", async (req: Request, res: Response) => {
  const email: string | undefined =
    typeof req.body.email === "string" && isEmail(req.body.email) ? req.body.email : undefined;
  if (typeof email === "undefined") {
    return sendJSONStatus<CheckResult>(res, {
      status: "WRONG",
    });
  }

  try {
    const existEmail = await User.exists({ email });
    return sendJSONStatus<CheckResult>(res, {
      status: existEmail ? "TAKEN" : "OK",
    });
  } catch (e) {
    return sendJSONStatus<CheckResult>(res, {
      status: "ERROR",
    });
  }
});

export default router;

class ApiAccountRegisterPayload {
  _valid = false;
  _message = "valid";
  name = "";
  email = "";
  password = "";
  passwordRepeat = "";

  constructor({
    name,
    email,
    password,
    passwordRepeat,
  }: {
    name: unknown;
    email: unknown;
    password: unknown;
    passwordRepeat: unknown;
  }) {
    if (typeof name !== "string" || !NAME_PATTERN.test(name)) {
      this._message = "name valid";
      return;
    }
    this.name = name;

    if (typeof email !== "string" || !validator.isEmail(email)) {
      this._message = "email valid";
      return;
    }
    this.email = email;

    // check password
    if (typeof password !== "string" || !PASSWORD_PATTERN.test(password)) {
      this._message = "password invalid";
      return;
    }
    this.password = password;

    if (typeof passwordRepeat !== "string" || password !== passwordRepeat) {
      this._message = "password unmatch";
      return;
    }
    this.passwordRepeat = passwordRepeat;

    this._valid = true;
  }
}
