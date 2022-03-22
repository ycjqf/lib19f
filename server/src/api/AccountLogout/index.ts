import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiAccountLogoutResponse } from "./types";

export default Router().all("/", async (req, res) => {
  const _response: ApiAccountLogoutResponse = { code: "OK", message: "" };
  const { session } = req;

  try {
    if (!session.data) {
      _response.code = "NOT_LOGGED_IN";
      _response.message = "you are not logged in";
      res.status(StatusCodes.OK);
      res.json(_response).end();
      return;
    }

    req.session.destroy(() => {
      _response.code = "OK";
      _response.message = "logout success";
      res.status(StatusCodes.OK);
      res.json(_response).end();
      return;
    });
  } catch (e) {
    _response.code = "INTERNAL_ERROR";
    _response.message = `logout failed: ${e instanceof Error ? e.message : "unknown error"}`;
    res.status(200).json(_response).end();
    return;
  }
});
