import express from "express";
import moment from "moment";

import AccountAuth_Route from "@/api/account/auth";
import AccountLogout_Route from "@/api/account/logout";
import AccountRegister_Route from "@/api/account/register";

moment.locale("zh-cn");

const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log(`访问接口 账户 ${moment().format("llll")}`);
  next();
});

router.use("/register", AccountRegister_Route);
router.use("/logout", AccountLogout_Route);
router.use("/auth", AccountAuth_Route);

export default router;
