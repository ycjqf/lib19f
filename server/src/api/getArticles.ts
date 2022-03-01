import { Router } from "express";
import { ApiGetArticlesResponse, ArticlePreview } from "@typings/api";
import { sendJSONStatus } from "@/util";
import { DEFAULT_ARTICLE_PAGE_SIZE, POSITIVE_INTEGER_REGEX } from "@typings/constants";
import Article from "@/models/Article";
import User from "@/models/User";

export default Router().post("/", async (request, response) => {
  const payload = new GetArticlesPayload(request.body.page, request.body.pageSize);
  if (!payload.checked) {
    return sendJSONStatus<ApiGetArticlesResponse>(response, {
      code: "WRONG_QUERY",
      message: payload.message,
      articles: [],
      total: 0,
      current: payload.body.page,
      pageSize: payload.body.pageSize,
    });
  }
  try {
    const total = await Article.countDocuments({});
    const articles = await Article.find()
      .select("id title description poster userId createdTime updatedTime -_id")
      .limit(payload.body.pageSize)
      .skip((payload.body.page - 1) * payload.body.pageSize)
      .sort("-updatedTime");
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
    return sendJSONStatus<ApiGetArticlesResponse>(response, {
      code: "OK",
      message: "ok",
      articles: await Promise.all(promises),
      total: total,
      current: payload.body.page,
      pageSize: payload.body.pageSize,
    });
  } catch (e) {
    return sendJSONStatus<ApiGetArticlesResponse>(response, {
      code: "INTERNAL_ERROR",
      message: `error,${e.message}`,
      articles: [],
      total: 0,
      current: payload.body.page,
      pageSize: payload.body.pageSize,
    });
  }
});
class GetArticlesPayload {
  checked = false;
  message: string;
  body: {
    page: number;
    pageSize: number;
  } = {
    page: 1,
    pageSize: DEFAULT_ARTICLE_PAGE_SIZE,
  };

  constructor(page: any, pageSize: any) {
    if (typeof page === "string" || typeof page === "number") {
      const testPage = `${page}`;
      if (POSITIVE_INTEGER_REGEX.test(testPage)) {
        this.body.page = parseInt(testPage);
      } else {
        this.message = "page should be a positive integer";
        return;
      }
    }

    if (typeof pageSize === "string" || typeof pageSize === "number") {
      const testPageSize = `${pageSize}`;
      if (POSITIVE_INTEGER_REGEX.test(testPageSize)) {
        this.body.pageSize = parseInt(testPageSize);
      } else {
        this.message = "page size should be a positive integer";
        return;
      }
    }
    this.message = "ok";
    this.checked = true;
  }
}
