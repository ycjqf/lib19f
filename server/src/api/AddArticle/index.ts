import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import User from "svr/models/User";
import { ApiAddArticleResponse } from "./types";
import ApiAddArticlePayload from "./payload";
import saveArticle from "./saveArticle";

export default Router().post("/", async (req, res) => {
  const _response: ApiAddArticleResponse = { code: "BAD_REQUEST", message: "" };

  if (!req.session.data || req.session.data.capacity !== "user") {
    _response.message = "not logged in";
    res.status(StatusCodes.UNAUTHORIZED);
    res.send(_response).end();
    return;
  }
  const user = await User.findOne({ id: req.session.data.id });
  if (!user) {
    return req.session.destroy(() => {
      _response.message = "invalid token";
      res.status(StatusCodes.UNAUTHORIZED);
      res.send(_response).end();
    });
  }

  const payload = new ApiAddArticlePayload({
    title: req.body.title,
    description: req.body.description,
    body: req.body.body,
  });

  if (!payload._valid) {
    _response.message = payload._message;
    res.status(StatusCodes.BAD_REQUEST);
    res.send(_response).end();
    return;
  }

  const saveResult = await saveArticle(payload, req.session.data.id);
  if (!saveResult.success) {
    _response.message = saveResult.message;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.send(_response).end();
    return;
  }

  _response.message = "ok";
  res.status(StatusCodes.OK);
  res.send(_response).end();
});
