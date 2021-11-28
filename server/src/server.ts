import express from "express";
import { connect } from "mongoose";

import ApiRouterAccount from "@/api/account/router";
import ApiRouterFetch from "@/api/fetch/router";
import { mongoServerString } from "@/util";

connect(mongoServerString)
  .then(() => {
    console.log(`🟢 数据库连接成功 ${mongoServerString}`);
    startServer();
  })
  .catch((error) => {
    return console.log("数据库启动出错出错了，检查后再起启动吧", error);
  });

function startServer() {
  const PORT = 1337;
  const app = express();

  app.use(express.json());
  app.disable("x-powered-by");
  app.use("/api/account", ApiRouterAccount);
  app.use("/api/fetch", ApiRouterFetch);

  app.use("/", (_req, res) => {
    return res.end("server for lib19f,advanded use please post to /api for more");
  });

  app.set("port", PORT);
  app.listen(PORT, () => {
    console.log(`✅ 应用运行在 http://localhost:${PORT} 模式为 ${app.get("env")}`);
  });
}
