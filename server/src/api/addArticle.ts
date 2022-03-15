import { Router } from "express";
import Article from "svr/models/Article";
import User from "svr/models/User";
import { ApiAddArticleResponse, SessionData } from "tps/api";
import { sendJSONStatus } from "svr/util";
import {
  MAX_ARTICLE_CHARS,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_ARTICLE_CHARS,
  MIN_TITLE_LENGTH,
} from "tps/constants";

const router = Router();

router.post("/", async (req, res) => {
  console.log(req.headers.cookie);
  const respond = (
    message: ApiAddArticleResponse["message"],
    code: ApiAddArticleResponse["code"] = "UNAUTHORIZED"
  ) => sendJSONStatus<ApiAddArticleResponse>(res, { code, message });

  const session = req.session as typeof req.session & { data: SessionData | undefined };
  if (!session.data || session.data.capacity !== "user") return respond("not logged");
  if (!(await User.exists({ id: session.data.id })))
    return session.destroy(() => respond("no such user"));

  const payload = new ApiAddArticlePayload({
    title: req.body.title,
    description: req.body.description,
    body: req.body.body,
  });

  if (!payload._valid) return respond(payload._message, "BAD_DATA");

  const saveResult = await savePayload(payload, session.data.id);
  if (!saveResult.success) return respond(saveResult.message, "INTERNAL_ERROR");

  return respond(saveResult.message, "OK");
});

export class ApiAddArticlePayload {
  _valid = false;
  _message = "valid";
  title = "";
  description = "";
  body = "";

  constructor({
    title,
    description,
    body,
  }: {
    title: string;
    description: string;
    body: unknown;
  }) {
    if (
      typeof title !== "string" ||
      title.trim().length < MIN_TITLE_LENGTH ||
      title.trim().length > MAX_TITLE_LENGTH
    ) {
      this._message = `title invalid`;
      return;
    }
    this.title = title.trim();

    if (typeof description !== "string" || description.trim().length > MAX_DESCRIPTION_LENGTH) {
      this._message = `description invalid`;
      return;
    }
    this.description = description.trim();

    if (
      typeof body !== "string" ||
      body.trim().length < MIN_ARTICLE_CHARS ||
      body.trim().length > MAX_ARTICLE_CHARS
    ) {
      this._message = `body invalid`;
      return;
    }
    this.body = body.trim();

    this._valid = true;
  }
}

async function savePayload(
  payload: ApiAddArticlePayload,
  userId: number
): Promise<{ success: boolean; message: string }> {
  if (!payload._valid) return { success: false, message: "article pattern wrong" };
  try {
    const article = new Article({
      title: payload.title,
      description: payload.description,
      body: payload.body,
      poster: "",
      userId,
    });

    await article.save();
    return { success: true, message: "article saved" };
  } catch (e) {
    return {
      success: false,
      message: `failed to save article${e instanceof Error && ` :${e.message}`}`,
    };
  }
}

export default router;
