import { Router } from "express";
import User from "@/models/User";
import { sendJSONStatus } from "@/util";
import {
  ApiLoginRequest,
  ApiLoginResponse,
  accountCapacities,
  SessionData,
} from "@typings/api";

export default Router().post("/", async (req, res) => {
  const currentResponse: ApiLoginResponse = { code: "BAD_FORM", message: "" };
  const setMsgNReturn = (msg: string) => {
    currentResponse.message = msg;
    return sendJSONStatus<ApiLoginResponse>(res, currentResponse);
  };
  const body: ApiLoginRequest = {
    name: typeof req.body.name === "string" ? req.body.name : "",
    email: typeof req.body.email === "string" ? req.body.email : "",
    password: typeof req.body.password === "string" ? req.body.password : "",
    capacity: typeof req.body.capacity === "string" ? req.body.capacity : "user",
  };

  currentResponse.code = "BAD_FORM";
  if (accountCapacities.find(capacity => capacity === body.capacity) === undefined)
    return setMsgNReturn("capacity is not valid");
  if (body.capacity !== "user")
    return setMsgNReturn("login as non-user is not implemented currently");
  if (typeof body.email !== "string" || body.email.trim() !== "")
    return setMsgNReturn("login by email is not implemented currently");
  if (typeof body.name !== "string" || body.name.trim() === "")
    return setMsgNReturn("login name should not be empty");

  try {
    currentResponse.code = "WRONG_CREDENTIAL";
    const user = await User.findOne({ name: body.name, password: body.password });
    if (!user) return setMsgNReturn("name or password wrong");

    currentResponse.code = "OK";
    const session = req.session as typeof req.session & { data: SessionData | undefined };
    if (session.data) return req.session.regenerate(() => setMsgNReturn("already logged in"));
    session.data = { id: user.id, capacity: "user" };
    return setMsgNReturn("login success");
  } catch (e) {
    currentResponse.code = "INTERNAL_ERROR";
    return setMsgNReturn(`login failed ${e.message}`);
  }
});
