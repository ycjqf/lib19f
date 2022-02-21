import { Router } from "express";
import { sendJSONStatus } from "@/util";

const router = Router();

router.post("/", async (req, res) => {
  console.log(req.session);
  // @ts-ignore
  if (req.session.data)
    // @ts-ignore
    return sendJSONStatus<{ isLogged: boolean; capacity: "user"; id: number }>(res, { isLogged: true, capacity: "user", id: req.session.data.id });
  res.clearCookie("connect.sid");
  return sendJSONStatus<{ isLogged: boolean; capacity: "user"; id: number }>(res, { isLogged: false, capacity: "user", id: 0 });
});

export default router;
