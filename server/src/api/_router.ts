import express from "express";
import expressJwt from "express-jwt";
import accountLogin from "@/api/accountLogin";
import accountRegister from "@/api/accountRegister";
import accountReauth from "@/api/accountReauth";
import addArticle from "@/api/addArticle";
import addComment from "@/api/addComment";
import { ACESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/psw.json";

const router = express.Router();

router.use(
  /^\/api\/(add|update|upload|delete)\/.*/,
  expressJwt({ secret: ACESS_TOKEN_SECRET, algorithms: ["HS256"] })
);
router.use(
  "/api/account/reauth",
  expressJwt({ secret: REFRESH_TOKEN_SECRET, algorithms: ["HS256"] })
);
router.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(err.status).send({ code: err.code, message: err.message });
  }
  next();
});

router.use("/api/account/register", accountRegister);
router.use("/api/account/login", accountLogin);
router.use("/api/account/reauth", accountReauth);
router.use("/api/add/article", addArticle);
router.use("/api/add/comment", addComment);

export default router;
