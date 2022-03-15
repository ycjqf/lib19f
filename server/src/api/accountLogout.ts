import { Router } from "express";
import { sendJSONStatus } from "svr/util";
import { ApiAccountLogoutRes, SessionData } from "tps/api";

export default Router().all("/", async (req, res) => {
  const session = req.session as typeof req.session & { data: SessionData | undefined };

  try {
    if (!session.data) {
      return sendJSONStatus<ApiAccountLogoutRes>(res, {
        code: "NOT_LOGGED_IN",
        message: "you are not logged in",
      });
    }

    req.session.destroy(() => {
      return sendJSONStatus<ApiAccountLogoutRes>(res, {
        code: "OK",
        message: "logout success",
      });
    });
  } catch (e) {
    return sendJSONStatus<ApiAccountLogoutRes>(res, {
      code: "INTERNAL_ERROR",
      message: `logout failed: ${e instanceof Error ? e.message : "unknown error"}`,
    });
  }
});
