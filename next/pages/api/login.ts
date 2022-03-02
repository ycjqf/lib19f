import { ApiLoginRequest, ApiLoginResponse } from "tps/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { cookiePost } from "nxt/utils/req";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiLoginResponse>
) {
  const form = req.body as ApiLoginRequest;
  const result = await cookiePost<ApiLoginRequest, ApiLoginResponse>(
    req,
    res,
    "http://localhost:1337/api/account/login",
    form
  );
  res.status(200).json(result);
}

// 540 课题研究背景及意义
