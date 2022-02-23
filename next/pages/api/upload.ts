import type { ApiAddArticleRequest, ApiAddArticleResponse } from "@typings/api";
import type { NextApiRequest, NextApiResponse } from "next";
import { cookiePost } from "@/utils/req";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiAddArticleResponse>
) {
  const form = req.body as ApiAddArticleRequest;
  const result = await cookiePost<ApiAddArticleRequest, ApiAddArticleResponse>(
    req,
    res,
    "http://localhost:1337/api/add/article",
    form
  );
  res.status(200).json(result);
}
