import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import User from "svr/models/User";
import { NAME_PATTERN } from "tps/constants";
import { ApiAccountRegisterCheckNameResponse } from "./types";

export default Router().post("/", async (req, res) => {
  const _response: ApiAccountRegisterCheckNameResponse = { status: "wrong" };
  const name: string | undefined =
    typeof req.body.name === "string" && NAME_PATTERN.test(req.body.name)
      ? req.body.name
      : undefined;
  if (typeof name === "undefined") {
    res.status(StatusCodes.OK);
    res.json(_response).end();
    return;
  }

  try {
    const existName = await User.exists({ name });
    _response.status = existName ? "taken" : "valid";
    res.status(StatusCodes.OK);
    res.json(_response).end();
    return;
  } catch (e) {
    _response.status = "error";
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json(_response).end();
    return;
  }
});
