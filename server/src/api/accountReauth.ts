import { Router } from "express";
import jwt from "jsonwebtoken";
import { ACESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, EXPIRE_TIME } from "@/psw.json";
import { ApiAccountReauthResponse } from "@typings/api";
import { sendJSONStatus } from "@/util";

const router = Router();

router.post("/", async (req, res) => {
  const authorization = req.headers.authorization.replace("Bearer ", "");
  const payload = jwt.verify(authorization, REFRESH_TOKEN_SECRET);
  if (typeof payload === "string" || !payload.id) return sendJSONStatus<ApiAccountReauthResponse>(res, { code: "INVALID_TOKEN", message: "令牌负载无效" }, 401);
  const { id, capacity } = payload;
  const accessToken = jwt.sign({ id, capacity }, ACESS_TOKEN_SECRET, { expiresIn: EXPIRE_TIME });
  return sendJSONStatus<ApiAccountReauthResponse>(res, { code: "OK", message: "成功", accessToken: accessToken }, 200);
});

export default router;
