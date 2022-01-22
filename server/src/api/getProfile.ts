import { Router } from "express";
import { ApiGetProfileRequest, ApiGetProfileResponse } from "@typings/api";
import { sendJSONStatus } from "@/util";
import User from "@/models/User";

const router = Router();

router.post("/", async (req, res) => {
  const parsed: ApiGetProfileRequest = {
    id: req.body.id,
  };

  if (typeof parsed.id !== "number" || parsed.id <= 0 || parsed.id !== parseInt(`${parsed.id}`, 10))
    return sendJSONStatus<ApiGetProfileResponse>(res, { code: "WRONG_ID", message: "id需为正整数" });

  const user = await User.findOne({ id: parsed.id });
  if (!user) return sendJSONStatus<ApiGetProfileResponse>(res, { code: "NO_SUCH_USER", message: "没有这个用户" });
  const { id, name, avatar } = user;

  return sendJSONStatus<ApiGetProfileResponse>(res, {
    code: "OK",
    message: "用户查询成功",
    profile: { id, name, avatar },
  });
});

export default router;
