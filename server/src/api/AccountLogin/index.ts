import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiAccountLoginPayload } from "./payload";
import { ApiAccountLoginResponse } from "./types";
import updateSession from "./updateSession";
import findAccount from "./findAccount";

export default Router().post("/", async (req, res): Promise<void> => {
  const _response: ApiAccountLoginResponse = { code: "BAD_REQUEST", message: "" };

  const { name, capacity, password, email, relog } = req.body;
  const payload = new ApiAccountLoginPayload({ name, capacity, password, email, relog });
  if (!payload._valid) {
    _response.message = payload._message;
    res.status(StatusCodes.BAD_REQUEST);
    res.json(_response).end();
    return;
  }

  const existenceResult = await findAccount(payload);
  _response.message = existenceResult.message;
  if (existenceResult.status === "error") {
    _response.code = "INTERNAL_ERROR";
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json(_response).end();
    return;
  }
  if (existenceResult.status === "no") {
    _response.code = "WRONG_CREDENTIAL";
    res.status(StatusCodes.OK);
    res.json(_response).end();
    return;
  }

  const updateSessionResult = await updateSession(req, payload, existenceResult.id);
  _response.message = updateSessionResult.message;
  if (updateSessionResult.status === "error") {
    _response.code = "INTERNAL_ERROR";
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json(_response).end();
    return;
  }
  if (updateSessionResult.status === "logged") {
    _response.code = "LOGGED";
    res.status(StatusCodes.OK);
    res.json(_response).end();
    return;
  }

  _response.code = "OK";
  res.status(StatusCodes.OK);
  res.json(_response).end();
  return;
});
