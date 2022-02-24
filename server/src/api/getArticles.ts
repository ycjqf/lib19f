import { Router } from "express";
import Article from "@/models/Article";
import {
  ApiGetArticlesRequest,
  ApiGetArticlesResponse,
  ArticlePreview,
  GetArticlesReq,
  GetArticlesRes,
} from "@typings/api";
import { sendJSONStatus } from "@/util";
import { DEFAULT_ARTICLE_PAGE_SIZE, POSITIVE_INTEGER_REGEX } from "@typings/constants";
import User from "@/models/User";

const router = Router();

router.post("/", async (req, res) => {
  const queried: ApiGetArticlesRequest = {
    page: req.body.page,
    pageSize: req.body.pageSize,
  };
  const havePageButInvalid = queried.page && !POSITIVE_INTEGER_REGEX.test(queried.page);
  const havePageSizeButInvalid =
    queried.pageSize && !POSITIVE_INTEGER_REGEX.test(queried.pageSize);
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
  const newPage =
    queried.page === null || typeof queried.page === "undefined" ? 1 : parseInt(queried.page);
  const newPageSize =
    queried.pageSize === null || typeof queried.pageSize === "undefined"
      ? DEFAULT_ARTICLE_PAGE_SIZE
      : parseInt(queried.pageSize);

  const total = await Article.countDocuments({});
  const articles = await Article.find()
    .select("id title description poster userId createdTime updatedTime -_id")
    .limit(newPageSize)
    .skip((newPage - 1) * newPageSize)
    .sort("-createdTime");

  const promises = articles.map(async (art): Promise<ArticlePreview> => {
    const { id, title, description, poster, userId, createdTime, updatedTime } = art;
    const user = await User.findOne({ id: userId });
    const { name, avatar } = user;
    return {
      id,
      title,
      description,
      poster,
      createdTime,
      updatedTime,
      profile: {
        id: userId,
        name,
        avatar,
      },
    };
  });

  const populatedArticles: ArticlePreview[] = await Promise.all(promises);

  return sendJSONStatus<ApiGetArticlesResponse>(res, {
    code: "OK",
    message: "success",
    articles: populatedArticles,
    total,
    current: newPage,
    pageSize: newPageSize,
  });
});

export default router;
