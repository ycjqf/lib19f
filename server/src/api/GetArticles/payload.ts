import { DEFAULT_ARTICLE_PAGE_SIZE, POSITIVE_INTEGER_REGEX } from "tps/constants";

export class ApiGetArticlesPayload {
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
