import { Router } from "express";
import { ApiDeleteArticleRequest, ApiDeleteArticleResponse, SessionData } from "tps/api";
import { sendJSONStatus } from "svr/util";
import Article from "svr/models/Article";

export default Router().post("/", async (req, res) => {
  const currentResponse: ApiDeleteArticleResponse = { code: "OK", message: "" };
  const session = req.session as typeof req.session & { data: SessionData | undefined };
  const parsed: ApiDeleteArticleRequest = { id: req.body.id };
  const respond = (msg: string) => {
    currentResponse.message = msg;
    return sendJSONStatus<ApiDeleteArticleResponse>(res, currentResponse);
  };

  try {
    currentResponse.code = "WRONG_ID";
    if (typeof parsed.id !== "string" || !/^[1-9]\d*$/.test(parsed.id))
      return respond("id is not a number string");

    currentResponse.code = "NOT_AUTHORIZED";
    if (!session.data) return respond("not logged in");
    if (session.data.capacity !== "user")
      return respond("delete as non-user is not implemented yet");

    currentResponse.code = "NO_SUCH_ARTICLE";
    const article = await Article.findOne({ id: parseInt(parsed.id) });
    if (!article) return respond("no such article");

    currentResponse.code = "NOT_AUTHORIZED";
    const { userId } = article;
    if (session.data.id !== userId) return respond("not the author");

    currentResponse.code = "OK";
    await article.delete();
    return respond("delete success");
  } catch (e) {
    currentResponse.code = "INTERNAL_ERROR";
    return respond("failed to delete");
  }
});
