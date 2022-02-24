import type { ApiAccountLogoutReq, ApiAccountLogoutRes } from "@typings/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { cookiePost } from "@/utils/req";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiAccountLogoutRes>
) {
  const result = await cookiePost<ApiAccountLogoutReq, ApiAccountLogoutRes>(
    req,
    res,
    "http://localhost:1337/api/account/logout",
    { test: "test" }
  );
  res.status(200).json(result);
}
