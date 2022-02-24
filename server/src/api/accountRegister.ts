import type { ApiRegisterRequest, ApiRegisterResponse } from "@typings/api";
import type { Request, Response } from "express";
import { accountCapacities } from "@typings/api";
import { Router } from "express";
import validator from "validator";
import User from "@/models/User";
import { sendJSONStatus } from "@/util";
import { NAME_PATTERN, PASSWORD_PATTERN } from "@typings/constants";

export default Router().post("/", async (req: Request, res: Response) => {
  const currentResponse: ApiRegisterResponse = { code: "PATTERN_UNMATCH", message: "" };
  const setMsgNReturn = (msg: string) => {
    currentResponse.message = msg;
    return sendJSONStatus<ApiRegisterResponse>(res, currentResponse);
  };
  const body: ApiRegisterRequest = {
    name: typeof req.body.name === "string" ? `${req.body.name}` : "",
    email: typeof req.body.email === "string" ? `${req.body.email}` : "",
    password: typeof req.body.password === "string" ? `${req.body.password}` : "",
    passwordRepeat:
      typeof req.body.passwordRepeat === "string" ? `${req.body.passwordRepeat}` : "",
    capacity: typeof req.body.capacity === "string" ? req.body.capacity : "user",
  };

  currentResponse.code = "PATTERN_UNMATCH";
  if (accountCapacities.find(capacity => capacity === req.body.capacity) === undefined)
    return setMsgNReturn("capacity is not valid");
  if (!validator.matches(body.name, NAME_PATTERN)) return setMsgNReturn("name is not valid");
  if (!validator.matches(body.password, PASSWORD_PATTERN))
    return setMsgNReturn("password is not valid");
  if (body.password !== body.passwordRepeat)
    return setMsgNReturn("password repeat is not valid");
  if (body.capacity !== "user")
    return setMsgNReturn("login as non-user is not implemented currently");
  if (!validator.isEmail(body.email)) return setMsgNReturn("email is not valid");

  currentResponse.code = "NAME_TAKEN";
  if (await User.exists({ name: body.name })) return setMsgNReturn("name is already taken");

  currentResponse.code = "EMAIL_TAKEN";
  if (await User.exists({ email: body.email })) return setMsgNReturn("email is already used");

  try {
    currentResponse.code = "OK";
    const newUser = new User({
      name: body.name,
      email: body.email,
      password: body.password,
      avatar: "",
      gender: "unset",
      introduction: "",
    });
    await newUser.save();
    return setMsgNReturn(`register success`);
  } catch (e) {
    currentResponse.code = "INTERNAL_ERROR";
    return setMsgNReturn(`register failed ${e.message}`);
  }
});
