import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import User from "svr/models/User";
import isEmail from "validator/lib/isEmail";
import { ApiAccountRegisterCheckEmailResponse } from "./types";

export default Router().post("/", async (req, res) => {
  const _response: ApiAccountRegisterCheckEmailResponse = { status: "wrong" };
  const email: string | undefined =
    typeof req.body.email === "string" && isEmail(req.body.email) ? req.body.email : undefined;
  if (typeof email === "undefined") {
    res.status(StatusCodes.OK);
    res.json(_response).end();
    return;
  }

  try {
    const existEmail = await User.exists({ email });
    _response.status = existEmail ? "taken" : "valid";
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
