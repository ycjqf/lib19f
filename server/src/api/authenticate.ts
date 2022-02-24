import { Router } from "express";
import { sendJSONStatus } from "@/util";
import { AuthenticateRes, SessionData } from "@typings/api";
import User from "@/models/User";

export default Router().all("/", async (req, res) => {
  const session = req.session as typeof req.session & { data: SessionData | undefined };
  if (!session.data) {
    req.session = null;
    return sendJSONStatus<AuthenticateRes>(res, { isLogged: false });
  }
  const { id, capacity } = session.data;
  let profile: AuthenticateRes["profile"] = undefined;
  const user = await User.findOne({ id: session.data.id });
  if (!user)
    return sendJSONStatus<AuthenticateRes>(res, {
      isLogged: true,
      data: { id: id, capacity: capacity },
      profile: profile,
    });

  const { name, avatar } = user;
  profile = { id, name, avatar };
});
