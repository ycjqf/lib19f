import { Router } from "express";

import { sendJSONStatus } from "@/utils/util";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const logoutBody: d.ApiAccountLogoutRequest = {
      token: req.body.token,
    };
    const session = true;
    if (session)
      return sendJSONStatus<d.ApiAccountLogoutRespond>(res, {
        code: 0,
        message: "logout success",
      });
    return sendJSONStatus<d.ApiAccountLogoutRespond>(res, {
      code: 1,
      message: "logout fail",
    });
  } catch (error) {
    return sendJSONStatus<d.ApiAccountLogoutRespond>(res, {
      code: 2,
      message: "bad server",
    });
  }
});

export default router;

namespace d {
  export interface ApiAccountLogoutRespond {
    /** 0 登陆成功 1 密码错误或用户不存在 2 登陆时服务出错 */
    code: 0 | 1 | 2;
    message: string;
  }
  export interface ApiAccountLogoutRequest {
    token: string;
  }
}
