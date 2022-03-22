import { Router } from "express";
import { sendJSONStatus } from "svr/util";
import User from "svr/models/User";
import { ApiAuthenticateResponse } from "./types";

export default Router().all("/", async (req, res) => {
  try {
    const currentResponse: ApiAuthenticateResponse = {
      code: "OK",
      isLogged: false,
      message: "",
    };
    const session = req.session;
    const respond = () => sendJSONStatus<ApiAuthenticateResponse>(res, currentResponse);

    if (!session.data) {
      currentResponse.message = "no session stored";
      return respond();
    }

    const { id, capacity } = session.data;
    let profile: ApiAuthenticateResponse["profile"] = undefined;
    const user = await User.findOne({ id: session.data.id });
    if (!user) {
      currentResponse.message = "user not found";
      return respond();
    }

    const { name, avatar } = user;
    profile = { id, name, avatar };
    return sendJSONStatus<ApiAuthenticateResponse>(res, {
      code: "OK",
      isLogged: true,
      message: "success",
      data: { id: id, capacity: capacity },
      profile: profile,
    });
  } catch (e) {
    return sendJSONStatus<ApiAuthenticateResponse>(res, {
      code: "INTERNAL_ERROR",
      isLogged: false,
      message: "internal error when authencating",
    });
  }
});
