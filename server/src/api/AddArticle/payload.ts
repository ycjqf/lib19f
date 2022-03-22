import {
  MAX_ARTICLE_CHARS,
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_ARTICLE_CHARS,
  MIN_TITLE_LENGTH,
} from "tps/constants";
import { ApiAddArticleRequest } from "./types";

export default class ApiAddArticlePayload implements ApiAddArticleRequest {
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
