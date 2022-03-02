import { Router } from "express";
import { ApiGetProfileRequest, ApiGetProfileResponse } from "tps/api";
import { sendJSONStatus } from "svr/util";
import User from "svr/models/User";
import { POSITIVE_INTEGER_REGEX } from "tps/constants";

const router = Router();

router.post("/", async (req, res) => {
  const params: ApiGetProfileRequest = {
    id: req.body.id,
    name: req.body.name,
  };

  if (typeof params.name === "string" && params.name.trim() !== "") {
    const user = await User.findOne({ name: params.name });
    if (!user)
      return sendJSONStatus<ApiGetProfileResponse>(res, {
        code: "NO_SUCH_USER",
        message: "没有此名称的用户",
      });
    const { id, name, avatar } = user;
    return sendJSONStatus<ApiGetProfileResponse>(res, {
      code: "OK",
      message: "用户查询成功",
      profile: { id, name, avatar },
    });
  }

  if (typeof params.id === "string" && POSITIVE_INTEGER_REGEX.test(params.id)) {
    const user = await User.findOne({ id: params.id });
    if (!user)
      return sendJSONStatus<ApiGetProfileResponse>(res, {
        code: "NO_SUCH_USER",
        message: "没有此ID的用户",
      });
    const { id, name, avatar } = user;
    return sendJSONStatus<ApiGetProfileResponse>(res, {
      code: "OK",
      message: "用户查询成功",
      profile: { id, name, avatar },
    });
  }

  if (
    typeof params.id !== "number" ||
    params.id <= 0 ||
    params.id !== parseInt(`${params.id}`, 10)
  )
    return sendJSONStatus<ApiGetProfileResponse>(res, {
      code: "WRONG_ID",
      message: "id需为正整数",
    });

  const user = await User.findOne({ id: params.id });
  if (!user)
    return sendJSONStatus<ApiGetProfileResponse>(res, {
      code: "NO_SUCH_USER",
      message: "没有这个用户",
    });
  const { id, name, avatar } = user;

  return sendJSONStatus<ApiGetProfileResponse>(res, {
    code: "OK",
    message: "用户查询成功",
    profile: { id, name, avatar },
  });
});

export default router;
