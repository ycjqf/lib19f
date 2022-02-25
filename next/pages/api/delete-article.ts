import type { ApiDeleteArticleRequest, ApiDeleteArticleResponse } from "@typings/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { cookiePost } from "@/utils/req";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiDeleteArticleResponse>
) {
  const form = req.body as ApiDeleteArticleRequest;
  const result = await cookiePost<ApiDeleteArticleRequest, ApiDeleteArticleResponse>(
    req,
    res,
    "http://localhost:1337/api/delete/article",
    form
  );
  res.status(200).json(result);
}
