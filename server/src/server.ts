import express from "express";
import { connect } from "mongoose";

import API from "@/api/_router";
import { mongoServerString } from "@/util";
import moment from "moment";
import jwt from "express-jwt";
moment.locale("zh-cn");

connect(mongoServerString)
  .then(() => {
    console.log(`🟢 数据库连接成功`);
    startServer();
  })
  .catch(error => {
    return console.log("数据库启动出错出错了，检查后再起启动吧", error);
  });

function startServer() {
  const PORT = 1337;
  const app = express();

  app.use(express.json());
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    console.log(
      `${req.method}[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${req.url} <== ${req.ip}`
    );
    next();
  });

  app.use(API);

  app.all("/", (req, res) => {
    return res.end("lib19f的后端服务，查看readme.md以了解更多");
  });

  app.all("*", (req, res) => {
    res.status(404);
    return res.end(`无效接口 invalid api`);
  });

  app.set("port", PORT);
  app.listen(PORT, () => {
    console.log(`🚀 运行在 http://localhost:${PORT} 模式为 ${app.get("env")}`);
  });
}
