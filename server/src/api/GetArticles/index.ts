import { Router } from "express";
import { ApiGetArticlesResponse, ArticlePreview } from "./types";
import { sendJSONStatus } from "svr/util";
import Article from "svr/models/Article";
import User from "svr/models/User";
import { ApiGetArticlesPayload } from "./payload";

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
