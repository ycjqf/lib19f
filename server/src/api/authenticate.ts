import { Router } from "express";
import { sendJSONStatus } from "@/util";
import { AuthenticateRes } from "@typings/api";
import User from "@/models/User";

const router = Router();

router.all("/", async (req, res) => {
  // @ts-ignore
  if (req.session.data) {
    // @ts-ignore
    const { id, capacity } = req.session.data;
    let profile: AuthenticateRes["profile"] = undefined;
    // @ts-ignore
    const user = await User.findOne({ id: req.session.data.id });
    if (user) {
      const { id, name, avatar } = user;
      profile = { id, name, avatar };
    }
    // @ts-ignore
    return sendJSONStatus<AuthenticateRes>(res, {
      isLogged: true,
      data: { id: id, capacity: capacity },
      profile: profile,
    });
  }
  req.session = null;
  return sendJSONStatus<AuthenticateRes>(res, { isLogged: false });
});

export default router;
