import type { ApiAccountLogoutRespond, ApiAccountLogoutRequest } from "@typings/api";
import { Router } from "express";

import { sendJSONStatus } from "@/util";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const logoutBody: ApiAccountLogoutRequest = {
      token: req.body.token,
    };
    const session = true;
    if (session)
      return sendJSONStatus<ApiAccountLogoutRespond>(res, {
        code: 0,
        message: "logout success",
      });
    return sendJSONStatus<ApiAccountLogoutRespond>(res, {
      code: 1,
      message: "logout fail",
    });
  } catch (error) {
    return sendJSONStatus<ApiAccountLogoutRespond>(res, {
      code: 2,
      message: "bad server",
    });
  }
});

export default router;
