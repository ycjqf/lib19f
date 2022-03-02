import { Router } from "express";
import { sendJSONStatus } from "svr/util";
import { ApiAccountLogoutRes, SessionData } from "tps/api";

export default Router().all("/", async (req, res) => {
  const session = req.session as typeof req.session & { data: SessionData | undefined };
  const currentResponse: ApiAccountLogoutRes = { code: "OK", message: "" };
  const setMsgNReturn = (msg: string) => {
    currentResponse.message = msg;
    return sendJSONStatus<ApiAccountLogoutRes>(res, currentResponse);
  };

  try {
    currentResponse.code = "NOT_LOGGED_IN";
    if (!session.data) return setMsgNReturn("not logged in");

    currentResponse.code = "OK";
    return req.session.destroy(() => setMsgNReturn("logout success"));
  } catch (e) {
    currentResponse.code = "INTERNAL_ERROR";
    return req.session.destroy(() => setMsgNReturn(`logout failed ${e.message}`));
  }
});
