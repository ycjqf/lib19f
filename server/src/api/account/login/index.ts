import { Router } from "express";
import { sendJSONStatus } from "svr/util";
import { ApiLoginResponse } from "tps/api";
import { ApiAccountLoginPayload } from "./payload";
import { ApiAccountLoginResponse } from "./types";
import { findAccount, updateSession } from "./utils";

export default Router().post("/", async (req, res): Promise<void> => {
  const _response: ApiAccountLoginResponse = { code: "BAD_REQUEST", message: "error" };

  const { name, capacity, password, email, relog } = req.body;
  const payload = new ApiAccountLoginPayload({ name, capacity, password, email, relog });
  if (!payload._valid) {
    _response.message = payload._message;
    res.status(400).json(_response).end();
    return;
  }

  const existenceResult = await findAccount(payload);
  if (existenceResult.status === "ERROR")
    return sendJSONStatus<ApiLoginResponse>(res, {
      code: "INTERNAL_ERROR",
      message: existenceResult.message,
    });
  if (existenceResult.status === "NO")
    return sendJSONStatus<ApiLoginResponse>(res, {
      code: "WRONG_CREDENTIAL",
      message: `${payload.capacity} ${payload._useCredential} or password is wrong`,
    });

  const updateSessionResult = await updateSession(req, payload, existenceResult.id);
  if (updateSessionResult.status === "error")
    return sendJSONStatus<ApiLoginResponse>(res, {
      code: "INTERNAL_ERROR",
      message: updateSessionResult.message,
    });
  if (updateSessionResult.status === "logged")
    return sendJSONStatus<ApiLoginResponse>(res, {
      code: "LOGGED",
      message: updateSessionResult.message,
    });
  return sendJSONStatus<ApiLoginResponse>(res, {
    code: "OK",
    message: updateSessionResult.message,
  });
});
