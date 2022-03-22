export default class ApiDeleteArticlePayload {
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
