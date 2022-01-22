import { Router } from "express";
import Article from "@/models/Article";
import { ApiGetArticlesRequest, ApiGetArticlesResponse } from "@typings/api";
import { sendJSONStatus } from "@/util";

const router = Router();

router.post("/", async (req, res) => {
  const parsed: ApiGetArticlesRequest = {
    page: req.body.page,
    pageSize: req.body.pageSize,
  };
  if (typeof parsed.page === "number" && (parsed.page <= 0 || parsed.page !== parseInt(`${parsed.page}`, 10)))
    return sendJSONStatus<ApiGetArticlesResponse>(res, { code: "WRONG_QUERY", message: "分页若存在需为正整数", articles: [], total: 0 });
  if (typeof parsed.pageSize === "number" && (parsed.pageSize <= 0 || parsed.pageSize !== parseInt(`${parsed.pageSize}`, 10)))
    return sendJSONStatus<ApiGetArticlesResponse>(res, { code: "WRONG_QUERY", message: "页面大小若存在需为正整数", articles: [], total: 0 });

  if (typeof parsed.page !== "number") parsed.page = 1;
  if (typeof parsed.pageSize !== "number") parsed.pageSize = 10;

  const total = await Article.countDocuments({});

  const articles = await Article.find()
    .select("id title description userId poster createdTime updatedTime -_id")
    .limit(parsed.pageSize)
    .skip(parsed.page - 1)
    .sort("-createdTime");

  return sendJSONStatus<ApiGetArticlesResponse>(res, { code: "OK", message: "测试", articles: articles, total });
});

export default router;
