import { Router } from "express";
import Article from "@/models/Article";
import { ApiGetArticlesRequest, ApiGetArticlesResponse, GetArticlesReq, GetArticlesRes } from "@typings/api";
import { sendJSONStatus } from "@/util";
import { DEFAULT_ARTICLE_PAGE_SIZE, POSITIVE_INTEGER_REGEX } from "@typings/constants";

const router = Router();

router.post("/", async (req, res) => {
  const queried: ApiGetArticlesRequest = {
    page: req.body.page,
    pageSize: req.body.pageSize,
  };
  const havePageButInvalid = queried.page && !POSITIVE_INTEGER_REGEX.test(queried.page);
  const havePageSizeButInvalid = queried.pageSize && !POSITIVE_INTEGER_REGEX.test(queried.pageSize);
  if (havePageButInvalid || havePageSizeButInvalid) {
    return sendJSONStatus<ApiGetArticlesResponse>(res, {
      code: "WRONG_QUERY",
      message: "分页若存在需为正整数",
      articles: [],
      total: 0,
      current: 1,
      pageSize: DEFAULT_ARTICLE_PAGE_SIZE,
    });
  }
  const newPage = queried.page === null ? 1 : parseInt(queried.page);
  const newPageSize = queried.pageSize === null ? DEFAULT_ARTICLE_PAGE_SIZE : parseInt(queried.pageSize);

  const total = await Article.countDocuments({});
  const articles = await Article.find()
    .select("id title description userId poster createdTime updatedTime -_id")
    .limit(newPageSize)
    .skip((newPage - 1) * newPageSize)
    .sort("-createdTime");

  return sendJSONStatus<ApiGetArticlesResponse>(res, {
    code: "OK",
    message: "success",
    articles: articles,
    total,
    current: newPage,
    pageSize: newPageSize,
  });
});

export default router;
