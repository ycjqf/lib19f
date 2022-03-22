import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiAccountRegisterResponse } from "./types";
import ApiAccountRegisterPayload from "./payload";
import checkExistence from "./checkExistence";
import saveUser from "./saveUser";

export default Router().post("/", async (req, res) => {
  const _response: ApiAccountRegisterResponse = { code: "BAD_REQUEST", message: "" };
  const { name, email, password, passwordRepeat } = req.body;
  const payload = new ApiAccountRegisterPayload({ name, email, password, passwordRepeat });

  _response.message = payload._message;
  if (!payload._valid) {
    res.status(StatusCodes.BAD_REQUEST);
    res.json(_response).end();
    return;
  }

  const existResult = await checkExistence(payload);
  _response.message = existResult.message;
  if (existResult.status === "error") {
    _response.code = "INTERNAL_ERROR";
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json(_response).end();
    return;
  }
  if (existResult.status === "name") {
    _response.code = "NAME_TAKEN";
    res.status(StatusCodes.OK);
    res.json(_response).end();
    return;
  }
  if (existResult.status === "email") {
    _response.code = "EMAIL_TAKEN";
    res.status(StatusCodes.OK);
    res.json(_response).end();
    return;
  }

  const saveUserResult = await saveUser(payload);
  _response.message = saveUserResult.message;
  if (saveUserResult.status === "error") {
    _response.code = "INTERNAL_ERROR";
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json(_response).end();
    return;
  }

  _response.code = "OK";
  res.status(StatusCodes.OK);
  res.json(_response).end();
});
