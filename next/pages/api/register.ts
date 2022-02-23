import { ApiRegisterRequest, ApiRegisterResponse } from "@typings/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiRegisterResponse>
) {
  const form = req.body as ApiRegisterRequest;
  const response = await fetch("http://localhost:1337/api/account/register", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  res.status(200).json(await response.json());
}
