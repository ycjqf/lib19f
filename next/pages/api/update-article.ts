import type { NextApiRequest, NextApiResponse } from "next";
import { cookiePost } from "@/utils/req";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = req.body;
  const result = await cookiePost(req, res, "http://localhost:1337/api/update/article", form);
  res.status(200).json(result);
}
