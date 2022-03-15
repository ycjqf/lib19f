import { Router } from "express";
import { ApiDeleteArticleResponse, SessionData } from "tps/api";
import { sendJSONStatus } from "svr/util";
import Article from "svr/models/Article";

export default Router().post("/", async (req, res) => {
  const currentResponse: ApiDeleteArticleResponse = { code: "OK", message: "" };
  const session = req.session as typeof req.session & { data: SessionData | undefined };
  const respond = (msg: string) => {
    currentResponse.message = msg;
    return sendJSONStatus<ApiDeleteArticleResponse>(res, currentResponse);
  };

  const payload = new ApiDeleteArticlePayload({
    id: req.body.id,
  });
  if (!payload._valid) return respond(payload._message);

  try {
    currentResponse.code = "NOT_AUTHORIZED";
    if (!session.data) return respond("not logged in");
    if (session.data.capacity !== "user")
      return respond("delete as non-user is not implemented yet");

    currentResponse.code = "NO_SUCH_ARTICLE";
    const article = await Article.findOne({ id: payload.id });
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

class ApiDeleteArticlePayload {
  _valid = false;
  _message = "valid";
  id = 0;

  constructor({ id }: { id: unknown }) {
    if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
      this._message = "id is not a number string";
      return;
    }

    this.id = parseInt(id);
    this._valid = true;
  }
}
