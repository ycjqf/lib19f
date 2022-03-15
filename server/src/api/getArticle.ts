import { Router } from "express";
import { ApiGetArticleResponse } from "tps/api";
import { sendJSONStatus } from "svr/util";
import Article from "svr/models/Article";
import User from "svr/models/User";

const router = Router();

router.post("/", async (req, res) => {
  const payload = new ApiGetArticlePayload({
    id: req.body.id,
  });
  if (!payload._valid)
    return sendJSONStatus<ApiGetArticleResponse>(res, {
      code: "WRONG_ID",
      message: "id should be positive interger string",
    });

  const article = await Article.findOne({ id: payload.id });
  if (!article)
    return sendJSONStatus<ApiGetArticleResponse>(res, {
      code: "NO_SUCH_ARTICLE",
      message: "no such article",
    });

  const { id, title, description, userId, body, createdTime, updatedTime, poster } = article;
  const user = await User.findOne({ id: userId });
  const name = user?.name ?? "unknown";
  const avatar = user?.avatar ?? "";
  return sendJSONStatus<ApiGetArticleResponse>(res, {
    code: "OK",
    message: "success",
    article: {
      id,
      title,
      description,
      userId,
      body,
      createdTime,
      updatedTime,
      poster,
    },
    profile: {
      id: userId,
      name,
      avatar,
    },
  });
});

class ApiGetArticlePayload {
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

export default router;
