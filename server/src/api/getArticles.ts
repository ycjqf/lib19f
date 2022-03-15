import { Router } from "express";
import { ApiGetArticlesResponse, ArticlePreview } from "tps/api";
import { sendJSONStatus } from "svr/util";
import { DEFAULT_ARTICLE_PAGE_SIZE, POSITIVE_INTEGER_REGEX } from "tps/constants";
import Article from "svr/models/Article";
import User from "svr/models/User";

export default Router().post("/", async (request, response) => {
  const payload = new ApiGetArticlesPayload({
    page: request.body.page,
    pageSize: request.body.pageSize,
  });
  if (!payload._valid) {
    return sendJSONStatus<ApiGetArticlesResponse>(response, {
      code: "WRONG_QUERY",
      message: payload._message,
      articles: [],
      total: 0,
      current: payload.page,
      pageSize: payload.pageSize,
    });
  }

  try {
    const total = await Article.countDocuments({});
    const articles = await Article.find()
      .select("id title description poster userId createdTime updatedTime -_id")
      .limit(payload.pageSize)
      .skip((payload.page - 1) * payload.pageSize)
      .sort("-updatedTime");
    const promises = articles.map(async (art): Promise<ArticlePreview> => {
      const { id, title, description, poster, userId, createdTime, updatedTime } = art;
      const user = await User.findOne({ id: userId });
      const name = user?.name ?? "unknown";
      const avatar = user?.avatar ?? "";
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
      current: payload.page,
      pageSize: payload.pageSize,
    });
  } catch (e) {
    return sendJSONStatus<ApiGetArticlesResponse>(response, {
      code: "INTERNAL_ERROR",
      message: `error,${e instanceof Error && e.message}`,
      articles: [],
      total: 0,
      current: payload.page,
      pageSize: payload.pageSize,
    });
  }
});

class ApiGetArticlesPayload {
  _valid = false;
  _message: string;
  page = 1;
  pageSize = DEFAULT_ARTICLE_PAGE_SIZE;

  constructor({ page, pageSize }: { page: unknown; pageSize: unknown }) {
    if (typeof page === "string" || typeof page === "number") {
      const testPage = `${page}`;
      if (POSITIVE_INTEGER_REGEX.test(testPage)) {
        this.page = parseInt(testPage);
      } else {
        this._message = "page should be a positive integer";
        return;
      }
    }

    if (typeof pageSize === "string" || typeof pageSize === "number") {
      const testPageSize = `${pageSize}`;
      if (POSITIVE_INTEGER_REGEX.test(testPageSize)) {
        this.pageSize = parseInt(testPageSize);
      } else {
        this._message = "page size should be a positive integer";
        return;
      }
    }
    this._message = "ok";
    this._valid = true;
  }
}
