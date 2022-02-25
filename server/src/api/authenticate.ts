import { Router } from "express";
import { sendJSONStatus } from "@/util";
import { AuthenticateRes, SessionData } from "@typings/api";
import User from "@/models/User";

export default Router().all("/", async (req, res) => {
  try {
    const currentResponse: AuthenticateRes = { isLogged: false, message: "" };
    const session = req.session as typeof req.session & { data: SessionData | undefined };
    const respond = () => sendJSONStatus<AuthenticateRes>(res, currentResponse);

    if (!session.data) {
      req.session = null;
      currentResponse.message = "no session stored";
      return respond();
    }

    const { id, capacity } = session.data;
    let profile: AuthenticateRes["profile"] = undefined;
    const user = await User.findOne({ id: session.data.id });
    if (!user) {
      currentResponse.message = "user not found";
      return respond();
    }

    const { name, avatar } = user;
    profile = { id, name, avatar };
    return sendJSONStatus<AuthenticateRes>(res, {
      isLogged: true,
      message: "success",
      data: { id: id, capacity: capacity },
      profile: profile,
    });
  } catch (e) {
    return sendJSONStatus<AuthenticateRes>(res, {
      isLogged: false,
      message: "internal error when authencating",
    });
  }
});
