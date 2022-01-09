import { Router } from "express";
import jwt from "jsonwebtoken";
import { ACESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, EXPIRE_TIME } from "@/psw.json";

const router = Router();

router.post("/", async (req, res) => {
  const authorization = req.headers.authorization.replace("Bearer ", "");
  const payload = jwt.verify(authorization, REFRESH_TOKEN_SECRET);
  if (typeof payload === "string" || !payload.id) return res.send("INVALID");
  const { id } = payload;
  const accessToken = jwt.sign({ id }, ACESS_TOKEN_SECRET, { expiresIn: EXPIRE_TIME });
  return res.send({ accessToken });
});

export default router;
