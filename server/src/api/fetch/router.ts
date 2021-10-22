import express from "express";
import moment from "moment";

import FetchArticle_Route from "@/api/fetch/article";

moment.locale("zh-cn");

const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log(`访问接口 抓取 ${moment().format("llll")}`);
  next();
});

router.use("/article", FetchArticle_Route);

export default router;
